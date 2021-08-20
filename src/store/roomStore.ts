import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit'
import { IRoom } from '../types/room';
import { ROOMS_REDUCER } from '../constants/room';
import { RoomDataService } from '../dataservices/RoomDataService';
import { Status, STATUS } from '../constants/api';

interface StoreLoadingStatus {
	status: Status
}

export interface LoadingStatus extends StoreLoadingStatus {
	status: 'loading',
}

export interface ReadyStatus extends StoreLoadingStatus {
	status: 'success',
}

export interface ErrorStatus extends StoreLoadingStatus {
	status: 'error',
	error: SerializedError,
}

export interface RoomStore {
	rooms: IRoom[],
	freeRooms: IRoom[],
	busyRooms: IRoom[],
}

export type ReadyRoomStore = (ReadyStatus & RoomStore);

export type RoomStoreType = LoadingStatus | ReadyRoomStore | ErrorStatus;

const initialState: RoomStoreType = { status: STATUS.LOADING } as RoomStoreType;

const FETCH_ROOMS_ACTION = 'rooms/fetchRooms';
export const fetchRooms = createAsyncThunk(FETCH_ROOMS_ACTION, async () => {
	return await RoomDataService.getRooms();
})

export const roomStore = createSlice({
	name: ROOMS_REDUCER,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchRooms.pending, (state) => {
			state.status = STATUS.LOADING;
		});
		builder.addCase(fetchRooms.fulfilled, (state, { payload: rooms }) => {
			const freeRooms: IRoom[] = [], busyRooms: IRoom[] = [];
			rooms.forEach((room) => room.isBusy
				? busyRooms.push(room)
				: freeRooms.push(room));
			
			return { status: STATUS.SUCCESS, rooms, busyRooms, freeRooms };
		});
		builder.addCase(fetchRooms.rejected, (state, { error }) => ({ status: STATUS.ERROR, error }));
	},
});

