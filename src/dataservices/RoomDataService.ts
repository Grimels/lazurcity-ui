import { IRoom } from '../types/room';
import { API } from '../constants/api';
import { ResponseParser } from '../utils/parseResponseModel';

const getRooms: () => Promise<IRoom[]> = () => fetch(`${API}/rooms`)
	.then(response => response.json())
	.then(rooms => (rooms as IRoom[]).map(room => ResponseParser.parseRoom(room)));

export const RoomDataService = {
	getRooms,
};
