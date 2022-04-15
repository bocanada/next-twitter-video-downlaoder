import React, { FC, useEffect, useState } from 'react';
import Card from './Card';
import Video from './Video';
import styles from '../styles/Home.module.css';
import { sortGifLast } from '../utils/sort';
import { Variants } from '../mongo/db';

export type VideoInfo = {
	URL: string;
	description: string;
	username: string;
	thumb?: string;
	id?: string;
	all: Variants[];
};

const VideoCard: FC<VideoInfo> = ({ URL: src, description, all }) => {

	const [blobURL, setBlobURL] = useState('');

	const downloadBlob = async () => {
		const videoResp = await fetch(src);
		const blob = await videoResp.blob();
		const blobUrl = URL.createObjectURL(blob);
		setBlobURL(blobUrl);
	};

	useEffect(() => { downloadBlob().catch(console.error); }, [src]);
	return (
		<Card >
			<Video src={blobURL} />
			<p className={styles.description}>
				{description}
			</p>
			Links:
			{all.sort(sortGifLast).map((v) => (
				<a href={v.url} key={v.res}> {v.res}p </a>
			))}
		</Card>);
};

export default VideoCard;