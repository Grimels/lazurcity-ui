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

