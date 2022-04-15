import { Collection, MongoClient, ObjectId } from 'mongodb';

export type Variants = {
	bitrate?: number;
	res: string;
	content_type: string;
	url: string;
};

export type Data = {
	uid?: ObjectId;
	tweetID?: string;
	error?: string;
	videos: Variants[];
	text?: string;
	username?: string;
	thumbnail?: string;
};

export const collections: { tweets?: Collection; } = {};

const connectToDB = async () => {
	if (collections.tweets !== undefined) {
		return;
	}
	const client = new MongoClient(process.env.DB_CONN_STR as string);
	await client.connect();

	const db = client.db(process.env.DB_NAME);

	const tweetsCollection = db.collection(process.env.COLLECTION_NAME as string);

	collections.tweets = tweetsCollection;
	console.log(`Collection: ${tweetsCollection}`);
};

export { connectToDB };