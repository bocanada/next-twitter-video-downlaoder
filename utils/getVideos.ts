import { Data } from '../pages/api/video/[id]';

export const getVideos = async (id: string) => {
	try {
		// Make a call to [base url]/api/video/[ID]
		const resp = await fetch(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/video/${id}`);
		const json: Data = await resp.json();
		return json;
	} catch (e) {
		console.error(e);
		throw new Error(`Failed to fetch tweet with id ${id}`);
	}
};
