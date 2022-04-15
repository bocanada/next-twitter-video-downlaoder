import React, { FC } from 'react';
import { Variants } from '../pages/api/video/[id]';
import Card from './Card';
import Video from './Video';
import styles from '../styles/Home.module.css';

export type VideoInfo = {
	URL: string;
	description: string;
	id?: string;
	all: Variants[];
};

const VideoCard: FC<VideoInfo> = ({ URL, description, all }) => {

	return (
		<Card >
			<Video src={URL} />
			<p className={styles.description}>
				{description}
			</p>
			{all.map((v) => (
				<a href={v.url} key={v.res}> {v.res}p </a>
			))}
		</Card>);
};

export default VideoCard;