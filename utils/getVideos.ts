import { Data } from '../pages/api/video/[id]';

export const getVideos = async (id: string) => {
	try {
		// Make a call to [base url]/api/video/[ID]
		const resp = await fetch(`http://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/video/${id}`);
		const json: Data = await resp.json();
		json.videos = json.videos.concat({ url: "", res: "gif", bitrate: 100, content_type: "gif" });
		return json;
	} catch (e) {
		console.error(e);
		throw new Error(`Failed to fetch tweet with id ${id}`);
	}
};
