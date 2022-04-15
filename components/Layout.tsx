import Image from 'next/image';
import React, { FC, ReactNode } from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head';

export const Layout: FC<{ children: ReactNode; title: string; description: string; ogImageURL?: string; }> = ({ title, description, ogImageURL, children }) => {
	return (
		<div className={styles.container}>
			<Head>
				<title>{title}</title>
				{/* Open-Graph stuff */}
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				{ogImageURL && <meta property="og:image" content={ogImageURL} />}
				{/* Twitter stuff */}
				<meta property="twitter:title" content={title} />
				<meta property="twitter:card" content="summary_large_image" />
				{ogImageURL && <meta property="twitter:image" content={ogImageURL} />}
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<main className={styles.main}>
					<div className={styles.grid}>
						<h1 className={styles.title}>
							Twitter video downloader!
						</h1>
						{children}
					</div>
				</main>

				<footer className={styles.footer}>
					<a
						href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Powered by{' '}
						<span className={styles.logo}>
							<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
						</span>
					</a>
				</footer>
			</main>
		</div>
	);

};;