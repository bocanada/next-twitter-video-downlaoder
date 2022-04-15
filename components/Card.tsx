import React, { FC, ReactNode } from 'react';
import styles from '../styles/Home.module.css';

const Card: FC<{ children: ReactNode; }> = ({ children }) => {
	return (
		<div className={styles.card}>
			{children}
		</div>
	);
};

export default Card;