import React, { FC, useState } from 'react';
import styles from '../styles/SearchBar.module.css';

type Props = {
	handleOnSubmit: (url: string) => void;
};

const SearchBar: FC<Props> = ({ handleOnSubmit }) => {
	const [url, setUrl] = useState('');
	const re = new RegExp(/^(https?:\/\/)?(www\.)?twitter\.com\/[\w]*\/status\/(?<ID>\d*)$/);
	return (
		<form onSubmit={(e) => {
			e.preventDefault();
			const matches = re.exec(url);
			if (!matches?.groups) {
				console.error("Brother...");
				return;
			}
			handleOnSubmit(matches.groups.ID);
		}}
			className={styles.form}>
			<input placeholder='Enter a tweet URL' value={url} type="text" onChange={e => setUrl(e.target.value)} className={styles.textInput} />
			<button type="submit" className={styles.submitButton} >Go!</button>
		</form>
	);
};

export default SearchBar;