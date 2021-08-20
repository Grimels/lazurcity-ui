// import {
// 	AccommodationDay,
// 	IAccommodation,
// 	RoomAccommodationsHistory,
// 	StartAccommodationDay,
// 	StartAccommodationState,
// } from '../types/accommodation';
// import { makeDayRangeGenerator } from './DayRangeGenerator';
// import { ACCOMMODATION_DAY_STATE } from '../constants/room';
// import { equalsDates } from './equals';
// import { IRoom } from '../types/room';
// import { formatDate, isWeekEndDay } from './dateUtils';
//
// const sortAccommodations = (accommodations: IAccommodation[]): IAccommodation[] => [...accommodations]
// 	.sort((r1, r2) => {
// 		const startDate1 = r1.startDate.getTime();
// 		const startDate2 = r2.startDate.getTime();
//
// 		if (startDate1 === startDate2) return 0;
// 		return startDate1 > startDate2 ? 1 : -1;
// 	});
//
// const buildRoomAccommodationsHistory = (startDate: Date, endDate: Date, room: IRoom): IAccommodationModel[] => {
// 	const accommodationByDay: Map<string, AccommodationDay> = new Map();
// 	Array.from(makeDayRangeGenerator(startDate, endDate))
// 		.forEach((date) => accommodationByDay.set(formatDate(date), {
// 			day: date,
// 			isWeekEndDay: isWeekEndDay(date),
// 			state: ACCOMMODATION_DAY_STATE.EMPTY,
// 		}));
// 	sortAccommodations(room.accommodations).forEach((accommodation) => {
// 		// @ts-ignore
// 		const diffTime = Math.abs(accommodation.endDate - accommodation.startDate);
// 		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//
// 		Array.from(makeDayRangeGenerator(accommodation.startDate, accommodation.endDate)).forEach(date => {
// 			const accommodationDay = accommodationByDay.get(formatDate(date));
// 			if (!accommodationDay) return;
//
// 			accommodationDay.accommodationId = accommodation.id;
// 			if (!accommodationDay.client) accommodationDay.client = accommodation.client;
// 			else accommodationDay.newClient = accommodation.client;
//
// 			if (equalsDates(accommodation.startDate, date)) {
// 				const startAccommodationDate: StartAccommodationDay = accommodationDay as StartAccommodationDay;
// 				startAccommodationDate.state = ACCOMMODATION_DAY_STATE.START as StartAccommodationState;
// 				startAccommodationDate.accommodationDaysLeft = diffDays;
// 				return;
// 			}
//
// 			accommodationDay.state = (equalsDates(accommodation.endDate, date) && ACCOMMODATION_DAY_STATE.FINISH)
// 				|| (ACCOMMODATION_DAY_STATE.IN_PROGRESS);
// 		});
// 	});
//
// 	const accommodationDays = [...accommodationByDay.values()];
// 	const accommodations: IAccommodationModel[] = [];
// 	for (let index = 0; index < accommodationDays.length; index++) {
// 		if (accommodationDays[index].state !== ACCOMMODATION_DAY_STATE.START) continue;
//
// 		const startAccommodationDay: StartAccommodationDay = accommodationDays[index] as StartAccommodationDay;
// 		const endAccommodationIndex = index + startAccommodationDay.accommodationDaysLeft - 1;
// 		const endAccommodation: AccommodationDay = accommodationDays[endAccommodationIndex];
// 		const accommodationItem: IAccommodationModel = {
// 			start: startAccommodationDay,
// 			end: endAccommodation,
// 			progressAccommodations: accommodationDays.filter((_, i) => i > index && endAccommodationIndex > i),
// 			id: startAccommodationDay.accommodationId,
// 		}
// 		accommodations.push(accommodationItem);
// 		index = endAccommodationIndex;
// 	}
//
// 	return accommodations;
// }
//
// export const buildAccommodationsHistory = (startDate: Date, endDate: Date, room: IRoom): RoomAccommodationsHistory => ({
// 	startRange: startDate,
// 	endRange: endDate,
// 	room,
// 	accommodations: buildRoomAccommodationsHistory(startDate, endDate, room),
// });

export const APP = 'app';
