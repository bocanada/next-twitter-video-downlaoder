import type { GetServerSideProps, NextPage } from 'next';
import { getVideos } from '../utils/getVideos';
import { Layout } from '../components/Layout';
import VideoCard, { VideoInfo } from '../components/VideoCard';
import { getMax } from '../utils/sort';

export const getServerSideProps: GetServerSideProps = async ({ res, query }) => {
	res.setHeader(
		'Cache-Control',
		'public, s-maxage=120, stale-while-revalidate=59'
	);
	const { id } = query;
	const response = await getVideos(id as string);
	try {
		const url = getMax(response.videos);
		return {
			props: {
				URL: url,
				description: response.text,
				thumb: response.thumbnail,
				all: response.videos,
				id: id,
			},
		};
	} catch (e) {
		console.error(e);
		throw new Error(`Couldn't fetch any video with id ${id}`);
	};
};


const Test: NextPage<VideoInfo> = (props) => {
	return (
		<Layout title={`Video from tweet: ${props.id}`} description={props.description} ogImageURL={props.thumb}>
			<VideoCard {...props} />
		</Layout >
	);
};


export default Test;;;;;