import { COLORS_PALETTE } from '../constants/colors';

export const getColorLine = (randomizer = 1) => {
	const index = randomizer % COLORS_PALETTE.length;
	return COLORS_PALETTE[index];
};
