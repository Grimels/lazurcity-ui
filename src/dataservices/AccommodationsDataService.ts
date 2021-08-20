import { API } from '../constants/api';
import { ResponseParser } from '../utils/parseResponseModel';
import { RoomAccommodationsHistory } from '../types/accommodation';
import { formatDate } from '../utils/dateUtils';


const getRoomAccommodationsHistory: (startDate: Date, endDate: Date) => Promise<RoomAccommodationsHistory[]> = (startDate, endDate) =>
	fetch(`${API}/accommodations/history/from/${formatDate(startDate)}/to/${formatDate(endDate)}`)
		.then(response => response.json())
		.then(roomsHistory => (roomsHistory as RoomAccommodationsHistory[])
			.map((roomHistory) => ResponseParser.parseAccommodationsHistory(roomHistory)),
		);

export const AccommodationsDataService = {
	getRoomAccommodationsHistory,
};