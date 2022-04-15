import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import SearchBar from '../components/SearchBar';
import React, { useState } from 'react';
import { getVideos } from '../utils/getVideos';
import { Layout } from '../components/Layout';
import VideoCard, { VideoInfo } from '../components/VideoCard';


const Home: NextPage = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();

  const handleOnSubmit = async (id: string) => {
    console.log(`Getting new tweet ${id}`);
    try {
      const json = await getVideos(id);
      const max = json.videos.reduce((prev, curr) => prev.res > curr.res ? prev : curr);
      setVideoInfo({ URL: max.url, description: json.text as string, all: json.videos, id: id });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout title="Twitter video downloader" description='Download twitter videos!'>
      <p className={styles.description}>
        Enter a tweet URL and then press
        <code className={styles.code}>ENTER</code>
      </p>
      <SearchBar handleOnSubmit={handleOnSubmit} />
      {videoInfo &&
        <VideoCard {...videoInfo} />}
    </Layout>
  );
};

export default Home;
