// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB, collections, Variants, Data } from '../../../mongo/db';


type TwitterResponse = {
  extended_entities?: {
    media: [
      {
        display_url: string;
        expanded_url: string;
        id: number;
        id_str: string;
        indices: number[];
        media_url_https: string;
        sizes: {
          [size: string]: {
            h: number;
            resize: "fit" | "crop";
            w: number;
          };
        };
        type: "video" | "image" | "animated_gif";
        url: string;
        video_info: {
          aspect_ratio: number[];
          duration_millis: number;
          variants: Variants[];
        } | null;
      }
    ];
  };
  user: {
    name: string;
    screen_name: string;
  };
  id_str: string;
  text: string;
};

enum HTTP {
  OK = 200,
  INTERNAL_ERR = 500,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

const filterVideos = (vids: Variants[]): Variants[] => {
  return vids.filter(v => {
    const url = v.url.split("?tag")[0];
    if (url.endsWith(".m3u8")) {
      return;
    }
    return v;
  }
  )
    .map((v) => {
      const url = v.url.split("?tag")[0];
      return {
        res: get_resolution(url),
        url: url,
        content_type: v.content_type,
      };
    });
};

const get_resolution = (url: string): string => {
  const res = /\/\d+x(\d+)/.exec(url);
  return res !== null ? res[1] : "gif";
};

const validateID = (id: string) => {
  if (!id) {
    return {
      error:
        'No id parameter was specified',
      videos: [],
    };
  }
  if (id.length < 10) {
    return {
      // bad request
      error: "The id should be numeric and more than 10 digits long.",
      videos: [],
    };
  };
  return null;
};

const getFromTwitter = async (id: string): Promise<{ status: HTTP, document: Data; }> => {
  const response = await fetch(
    `https://api.twitter.com/1.1/statuses/show.json?id=${id}&include_entities=true`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    return {
      status: response.status, document: {
        error: "Tweet not found.",
        videos: [],
      }
    };
  }
  const json: TwitterResponse = await response.json();
  const media = json.extended_entities?.media[0];
  const type = media?.type;
  if (!(type === "video" || type === "animated_gif")) {
    return {
      status: HTTP.NOT_FOUND, document: {
        error: "No videos available for specified tweet.",
        videos: [],
      }
    };
  };
  const videos = media?.video_info?.variants;
  if (videos === undefined) {
    return {
      status: HTTP.NOT_FOUND, document: {
        error: "No videos available for specified tweet.",
        videos: [],
      }
    };
  }
  return {
    status: HTTP.OK, document: {
      tweetID: id as string,
      videos: filterVideos(videos),
      username: json.user.screen_name,
      thumbnail: media?.media_url_https,
      text: json.text,
    }
  };
};

type Response = Data | Error;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Response>
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed", videos: [] });
  }
  const { id } = req.query;
  const error = validateID(id as string);
  if (error) {
    res.status(HTTP.BAD_REQUEST).json(error);
  }
  // Connect to mongodb <=> collections.tweets is undefined
  await connectToDB();

  const data = (await collections.tweets?.findOne({ tweetID: id })) as unknown as Data;
  if (data !== null) {
    return res.status(200).json(data);
  }

  try {
    const { status, document } = await getFromTwitter(id as string);
    if (status !== HTTP.OK) {
      return res.status(status).json(document);
    }
    const result = await collections.tweets?.insertOne(document);
    console.log(result);

    return res.status(HTTP.OK).json(document);
  } catch (e) {
    return res.status(HTTP.INTERNAL_ERR).json({ error: (e as Error).message, videos: [] });

  }
};

export default handler;