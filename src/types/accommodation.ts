import { IClient } from './client';
import { IRoom, IRoomProjection } from './room';

export interface IAccommodation {
	room: IRoom,
	client: IClient,
	startDate: Date,
	endDate: Date,
	id: number,
	quantity: number,
	price: number,
}

export interface AccommodationInfo {
	client: IClient,
	startDate: Date,
	endDate: Date,
	id: number,
	daysLeft: number,
	quantity: number,
	price: number,
	roomName: string,
	roomId: number,
}

export interface RoomAccommodationsHistory {
	startRange: Date,
	endRange: Date,
	
	room: IRoomProjection,
	accommodations: Array<AccommodationInfo>,
}

export interface AccommodationsStatistics {
	day: Date,
	roomsLeavingToday: number,
	dailyIncome: number,
	freeRooms: number,
	busyRooms: number,
	seasonIncomeByRoomName: Map<string, number>,
	seasonIncomeByRoomCategory: Map<string, number>,
	incomesByKey: Map<string, number>,
}
export interface AccommodationsStatisticsResponse {
	day: Date,
	roomsLeavingToday: number,
	dailyIncome: number,
	freeRooms: number,
	busyRooms: number,
	seasonIncomeByRoomName: {},
	seasonIncomeByRoomCategory: {},
	incomesByKey: { [key: string]: number},
}