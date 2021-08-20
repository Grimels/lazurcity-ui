import { IRoom } from '../types/room';
import { IAccommodation } from '../types/accommodation';

export const retrieveLatestAccommodation = (room: IRoom): IAccommodation | undefined => {
	const accommodations = room.accommodations;
	if (!accommodations || accommodations.length === 0) return;
	
	let latestAccommodation = accommodations[0];
	for (const accommodation of accommodations) {
		if (latestAccommodation.startDate < accommodation.startDate) {
			latestAccommodation = accommodation;
		}
	}
	return latestAccommodation;
}
