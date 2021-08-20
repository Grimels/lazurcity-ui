import { COLORS_PALETTE } from '../constants/colors';


export const getRandomColor = (randomizer = 1) => {
	const index = Math.floor(Math.random() * 100 * randomizer) % COLORS_PALETTE.length;
	return COLORS_PALETTE[index];
};
