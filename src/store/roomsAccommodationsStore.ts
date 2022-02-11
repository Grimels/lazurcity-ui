import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit'
import { Status, STATUS } from '../constants/api';
import { IAccommodation, RoomAccommodationsHistory } from '../types/accommodation';
import { AccommodationsDataService } from '../dataservices/AccommodationsDataService';
import { toAccommodationInfo } from '../utils/RoomAccommodationsBuilder';
import { differenceInDays } from 'date-fns';

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

const initialState: RoomsAccommodationsStoreType = {status: STATUS.LOADING} as RoomsAccommodationsStoreType;

const FETCH_ROOMS_ACCOMMODATIONS_ACTION = 'rooms/fetchRoomsAccommodationsHistory';
export const fetchRoomsAccommodationsHistory = createAsyncThunk<{ startDate: Date, endDate: Date, history: RoomAccommodationsHistory[] }, { startDate: Date, endDate: Date }>
(FETCH_ROOMS_ACCOMMODATIONS_ACTION, async ({startDate, endDate}) => {
    const history = await AccommodationsDataService.getRoomAccommodationsHistory(startDate, endDate);
    return {startDate, endDate, history};
})

const UPDATE_ACCOMMODATION_ACTION = 'rooms/updateAccommodation';
export const updateRoomAccommodation = createAsyncThunk<Partial<{
    accommodationId: number,
    startDate: Date,
    endDate: Date,
    quantity: number,
    price: number,
    clientName: string,
    clientPhoneNumber: string,
    isFinal: boolean,
    comment: string,
}>, Partial<{
    accommodationId: number,
    startDate: Date,
    endDate: Date,
    quantity: number,
    price: number,
    clientName: string,
    clientPhoneNumber: string,
    isFinal: boolean,
    comment: string,
}>>(UPDATE_ACCOMMODATION_ACTION, async ({
                                            accommodationId,
                                            startDate,
                                            endDate,
                                            quantity,
                                            price,
                                            clientName,
                                            clientPhoneNumber,
                                            isFinal,
                                            comment,
                                        }) => {
    if (accommodationId == null || startDate == null || endDate == null || quantity == null || price == null || clientName == null || clientPhoneNumber == null || comment == null) {
        return Promise.reject(new Error('Invalid update request!'));
    }
    await AccommodationsDataService.updateAccommodation(accommodationId, startDate, endDate, quantity, price, clientName, clientPhoneNumber, Boolean(isFinal), comment);
    return {accommodationId, startDate, endDate, quantity, price, clientName, clientPhoneNumber, isFinal, comment};
});

const CREATE_ACCOMMODATION_ACTION = 'rooms/createAccommodation';
export const createRoomAccommodation = createAsyncThunk<IAccommodation, Partial<{
    roomId: number,
    clientName: string,
    clientPhoneNumber: string,
    startDate: Date,
    endDate: Date,
    quantity: number,
    price: number,
    isFinal: boolean,
    comment: string,
}>>(CREATE_ACCOMMODATION_ACTION, async ({
                                            roomId,
                                            clientName,
                                            clientPhoneNumber,
                                            startDate,
                                            endDate,
                                            quantity,
                                            price,
                                            isFinal,
                                            comment,
                                        }) => {
    if (roomId == null || startDate == null || endDate == null || quantity == null || price == null || clientName == null || clientPhoneNumber == null || comment == null) {
        return Promise.reject(new Error('Invalid create request!'));
    }
    return await AccommodationsDataService.createAccommodation(roomId, clientName, clientPhoneNumber, startDate, endDate, quantity, price, Boolean(isFinal), comment);
});

const DELETE_ACCOMMODATION_ACTION = 'rooms/deleteAccommodation';
export const deleteRoomAccommodation = createAsyncThunk<number, number>(DELETE_ACCOMMODATION_ACTION, async (accommodationId) => {
    await AccommodationsDataService.deleteAccommodation(accommodationId);
    return accommodationId;
});

export const roomsAccommodationsHistoryStore = createSlice({
    name: 'roomsAccommodationsHistory',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchRoomsAccommodationsHistory.pending, (state) => {
            state.status = STATUS.LOADING;
        });
        builder.addCase(fetchRoomsAccommodationsHistory.fulfilled, (state, {
            payload: {
                startDate,
                history,
                endDate
            }
        }) => {
            return {status: STATUS.SUCCESS, roomsHistory: history, startDate, endDate};
        });
        builder.addCase(fetchRoomsAccommodationsHistory.rejected, (state, {error}) => ({status: STATUS.ERROR, error}));

        builder.addCase(updateRoomAccommodation.rejected, (state, {error}) => ({status: STATUS.ERROR, error}));
        builder.addCase(updateRoomAccommodation.fulfilled, (state, {payload}) => {
            const history: RoomAccommodationsHistory[] = (state as RoomsAccommodationsHistoryStore).roomsHistory;
            let roomIndex = -1;
            let accommodationIndex = -1;
            history.forEach((roomHistory, index) => {
                const accommodation = roomHistory.accommodations
                    .find(accommodation => accommodation.id === payload.accommodationId);
                if (accommodation !== undefined) {
                    roomIndex = index;
                    accommodationIndex = roomHistory.accommodations.indexOf(accommodation);
                    return;
                }
            })
            if (roomIndex === -1 || accommodationIndex === -1) throw new Error("Accommodation not found!");
            console.log(roomIndex, accommodationIndex);

            const searchedAccommodation = history[roomIndex].accommodations[accommodationIndex];
            history[roomIndex].accommodations = history[roomIndex].accommodations
                .filter(accommodation => accommodation.id !== searchedAccommodation.id);

            const updatedAccommodation = {...searchedAccommodation, ...payload};
            updatedAccommodation.daysLeft = differenceInDays(updatedAccommodation.endDate, updatedAccommodation.startDate);
            if (payload.clientName) updatedAccommodation.client.name = payload.clientName;
            if (payload.clientPhoneNumber) updatedAccommodation.client.phoneNumber = payload.clientPhoneNumber;
            history[roomIndex].accommodations.push(updatedAccommodation);
        });
        builder.addCase(createRoomAccommodation.rejected, (state, {error}) => ({status: STATUS.ERROR, error}));
        builder.addCase(createRoomAccommodation.fulfilled, (state, {payload: accommodation}) => {
            const history: RoomAccommodationsHistory[] = (state as RoomsAccommodationsHistoryStore).roomsHistory;
            let searchedRoomHistory;
            for (const roomHistory of history) {
                if (roomHistory.room.id !== accommodation.room.id) continue;

                searchedRoomHistory = roomHistory;
                break;
            }
            if (!searchedRoomHistory) throw new Error("Room history not found!");
            console.log(searchedRoomHistory);

            searchedRoomHistory.accommodations.push(toAccommodationInfo(accommodation));
        });
        builder.addCase(deleteRoomAccommodation.fulfilled, (state, {
            payload: accommodationId
        }) => {
            const history: RoomAccommodationsHistory[] = (state as RoomsAccommodationsHistoryStore).roomsHistory;
            for (const roomHistory of history) {
                roomHistory.accommodations = roomHistory.accommodations
                    .filter(accommodation => accommodation.id !== accommodationId);
            }
        });
    },
});

