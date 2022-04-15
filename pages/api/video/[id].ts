// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export type Variants = {
  bitrate?: number;
  res: string;
  content_type: string;
  url: string;
};

type TwitterResponse = {
  extended_entities: {
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
  id_str: string;
  text: string;
};

enum HTTP {
  OK = 200,
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

export type Data = {
  error?: string;
  videos: Variants[];
  text?: string;
  thumbnail?: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed", videos: [] });
  }
  const { id } = req.query;
  if (!id) {
    return res.status(HTTP.BAD_REQUEST).json({
      error:
        'No id parameter was specified',
      videos: [],
    });
  }
  if (id.length < 10) {
    return res.status(HTTP.BAD_REQUEST).json(
      {
        // bad request
        error: "The id should be numeric and more than 10 digits long.",
        videos: [],
      });
  };
  const response = await fetch(
    `https://api.twitter.com/1.1/statuses/show.json?id=${id}&include_entities=true&trim_user=true`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    return res.status(response.status).json({
      error: "Tweet not found.",
      videos: [],
    });
  }
  const json: TwitterResponse = await response.json();
  const media = json.extended_entities.media[0];
  const type = media.type;
  if (!(type === "video" || type === "animated_gif")) {
    return res.status(HTTP.NOT_FOUND).json({
      error: "No videos available for specified tweet.",
      videos: [],
    });
  }
  const videos = media.video_info?.variants;
  if (videos === undefined) {
    return res.status(HTTP.NOT_FOUND).json({
      error: "No videos available for specified tweet.",
      videos: [],
    });
  }
  return res.status(HTTP.OK).json({
    videos: filterVideos(videos),
    thumbnail: media.media_url_https,
    text: json.text,
  });
};

export default handler;