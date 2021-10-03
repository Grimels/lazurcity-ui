import { IRoom, IRoomProjection } from '../types/room';
import {
	AccommodationInfo,
	AccommodationsStatistics, AccommodationsStatisticsResponse,
	IAccommodation,
	RoomAccommodationsHistory,
} from '../types/accommodation';
import { IClient } from '../types/client';
import { dateInRange } from './equals';

class Parser {
	
	parseResponseClientModel = (client: IClient): IClient => {
		return {
			name: client.name,
			phoneNumber: client.phoneNumber,
			comment: client.comment,
		}
	}
	
	parseResponseAccommodationModel = (accommodation: IAccommodation): IAccommodation => {
		return {
			id: accommodation.id,
			room: this.parseResponseRoomModel(accommodation.room),
			client: this.parseResponseClientModel(accommodation.client),
			startDate: new Date(accommodation.startDate),
			endDate: new Date(accommodation.endDate),
			quantity: accommodation.quantity,
			price: accommodation.price,
		}
	}
	
	parseResponseRoomModel = (room: IRoom): IRoom => {
		return {
			id: Number(room.id),
			name: room.name,
			description: room.description,
			type: room.type,
			isBusy: room.isBusy,
			accommodations: room.accommodations?.map(accommodation => this.parseResponseAccommodationModel(accommodation)),
		}
	}
	
	parseResponseAccommodationHistoryModel = (roomAccommodationsHistory: RoomAccommodationsHistory): RoomAccommodationsHistory => {
		return {
			startRange: new Date(roomAccommodationsHistory.startRange),
			endRange: new Date(roomAccommodationsHistory.endRange),
			
			room: this.parseResponseRoomInfo(
				roomAccommodationsHistory.room,
				new Date(roomAccommodationsHistory.startRange),
				new Date(roomAccommodationsHistory.endRange),
			),
			accommodations: roomAccommodationsHistory.accommodations
				.map((accommodation) => this.parseResponseAccommodationDayModel(accommodation)),
		}
	}
	
	parseResponseRoomInfo = (roomInfo: IRoomProjection, startDate: Date, endDate: Date): IRoomProjection => {
		return {
			id: roomInfo.id,
			name: roomInfo.name,
			description: roomInfo.description,
			type: roomInfo.type,
			isBusy: dateInRange(new Date(), startDate, endDate),
		}
	}
	
	parseResponseAccommodationDayModel = (accommodationDay: AccommodationInfo): AccommodationInfo => {
		return {
			id: accommodationDay.id,
			daysLeft: accommodationDay.daysLeft,
			client: this.parseResponseClientModel(accommodationDay.client),
			startDate: new Date(accommodationDay.startDate),
			endDate: new Date(accommodationDay.endDate),
			price: accommodationDay.price,
			quantity: accommodationDay.quantity,
			roomName: accommodationDay.roomName,
			roomId: accommodationDay.roomId,
		}
	}

	parseResponseAccommodationStatisticsModel = (statistics: AccommodationsStatisticsResponse): AccommodationsStatistics => {
		return {
			day: statistics.day,
			dailyIncome: statistics.dailyIncome,
			busyRooms: statistics.busyRooms,
			freeRooms: statistics.freeRooms,
			roomsLeavingToday: statistics.roomsLeavingToday,
			seasonIncomeByRoomName: new Map(Object.entries(statistics.seasonIncomeByRoomName)),
			seasonIncomeByRoomCategory: new Map(Object.entries(statistics.seasonIncomeByRoomCategory)),
			incomesByKey: new Map(Object.entries(statistics.incomesByKey).map(([key, value]) => [String(key), Number(value)])),
		}
	}
}

const parser = new Parser();

export const ResponseParser = {
	parseClient: parser.parseResponseClientModel,
	parseRoom: parser.parseResponseRoomModel,
	parseAccommodationsHistory: parser.parseResponseAccommodationHistoryModel,
	parseAccommodation: parser.parseResponseAccommodationModel,
	parseAccommodationsStatistics: parser.parseResponseAccommodationStatisticsModel,
}