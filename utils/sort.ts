import { Variants } from '../pages/api/video/[id]';

export const sortGifLast = (a: Variants, b: Variants) => {
	const x = Number.parseInt(a.res, 10);
	const y = Number.parseInt(b.res, 10);
	if (Number.isNaN(x) || Number.isNaN(y)) {
		return -1;
	}
	return x > y ? -1 : 1;
};