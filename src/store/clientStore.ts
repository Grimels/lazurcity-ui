import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit'
import { IRoom } from '../types/room';
import { ROOMS_REDUCER } from '../constants/room';
import { RoomDataService } from '../dataservices/RoomDataService';
import { Status, STATUS } from '../constants/api';
import { IClient } from '../types/client';
import { ClientDataService } from '../dataservices/ClientDataService';
import { CLIENTS_REDUCER } from '../constants/client';

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

export interface ClientStore {
	clients: IClient[],
}

export type ReadyClientStore = (ReadyStatus & ClientStore);

export type ClientStoreType = LoadingStatus | ReadyClientStore | ErrorStatus;

const initialState: ClientStoreType = { status: STATUS.LOADING } as ClientStoreType;

const FETCH_CLIENTS_ACTION = 'clients/fetchClients';
export const fetchClients = createAsyncThunk(FETCH_CLIENTS_ACTION, async () => {
	return await ClientDataService.getClients();
})

export const clientStore = createSlice({
	name: CLIENTS_REDUCER,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchClients.pending, (state) => {
			state.status = STATUS.LOADING;
		});
		builder.addCase(fetchClients.fulfilled, (state, { payload: clients }) => {
			return { status: STATUS.SUCCESS, clients };
		});
		builder.addCase(fetchClients.rejected, (state, { error }) => ({ status: STATUS.ERROR, error }));
	},
});

