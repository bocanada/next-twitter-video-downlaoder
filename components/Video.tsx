import React, { FC, KeyboardEvent, useEffect, useState } from 'react';

const Video: FC<{ src: string; }> = ({ src }) => {
	const [blobURL, setBlobURL] = useState('');

	const downloadBlob = async () => {
		const videoResp = await fetch(src);
		const blob = await videoResp.blob();
		const blobUrl = URL.createObjectURL(blob);
		setBlobURL(blobUrl);
	};

	const togglePlay = async (el: HTMLVideoElement) => (el.paused ? el.play() : el.pause());
	useEffect(() => {
		downloadBlob().catch(console.error);
	}, [src, downloadBlob]);

	const handleKeyDown = (e: KeyboardEvent<HTMLVideoElement>) => {
		switch (e.key) {
			case 'm' || 'M':
				e.currentTarget.muted = !e.currentTarget.muted;
				break;
			default:
				break;
		}
		console.log(e.key);
	};

	if (blobURL !== '') {
		return (
			<video onKeyDown={handleKeyDown} onClick={(e) => togglePlay(e.target as HTMLVideoElement).catch(console.error)} src={blobURL} autoPlay muted />
		);
	}
	return <h2>Loading...</h2>;
};

export default Video;
