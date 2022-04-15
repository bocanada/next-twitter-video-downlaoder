import React, { FC, KeyboardEvent } from 'react';

const Video: FC<{ src: string; }> = ({ src }) => {

	const togglePlay = async (el: HTMLVideoElement) => (el.paused ? el.play() : el.pause());

	const handleKeyDown = (e: KeyboardEvent<HTMLVideoElement>) => {
		switch (e.key) {
			case 'm' || 'M':
				e.currentTarget.muted = !e.currentTarget.muted;
				break;
			default:
				break;
		}
	};

	return (
		<video
			onKeyDown={handleKeyDown}
			onClick={(e) => togglePlay(e.target as HTMLVideoElement).catch(console.error)}
			src={src}
			autoPlay
			muted
			loop />
	);
};

export default Video;
