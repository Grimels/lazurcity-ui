import {createAsyncThunk, createSlice, SerializedError} from '@reduxjs/toolkit'
import {Status, STATUS} from '../constants/api';
import {RoomAccommodationsHistory} from '../types/accommodation';
import {AccommodationsDataService} from '../dataservices/AccommodationsDataService';

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

export interface RoomsAccommodationsHistoryStore extends ReadyStatus {
	startDate: Date,
	endDate: Date,
	roomsHistory: RoomAccommodationsHistory[],
}

export type RoomsAccommodationsStoreType = LoadingStatus | RoomsAccommodationsHistoryStore | ErrorStatus;

const initialState: RoomsAccommodationsStoreType = { status: STATUS.LOADING } as RoomsAccommodationsStoreType;

const FETCH_ROOMS_ACCOMMODATIONS_ACTION = 'rooms/fetchRoomsAccommodationsHistory';
export const fetchRoomsAccommodationsHistory = createAsyncThunk<{ startDate: Date, endDate: Date, history: RoomAccommodationsHistory[] }, { startDate: Date, endDate: Date }>
(FETCH_ROOMS_ACCOMMODATIONS_ACTION, async ({ startDate, endDate }) => {
	const history = await AccommodationsDataService.getRoomAccommodationsHistory(startDate, endDate);
	return { startDate, endDate, history };
})

export const roomsAccommodationsHistoryStore = createSlice({
	name: 'roomsAccommodationsHistory',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchRoomsAccommodationsHistory.pending, (state) => {
			state.status = STATUS.LOADING;
		});
		builder.addCase(fetchRoomsAccommodationsHistory.fulfilled, (state, { payload: { startDate, history, endDate } }) => {
			return { status: STATUS.SUCCESS, roomsHistory: history, startDate, endDate };
		});
		builder.addCase(fetchRoomsAccommodationsHistory.rejected, (state, { error }) => ({ status: STATUS.ERROR, error }));
	},
});

