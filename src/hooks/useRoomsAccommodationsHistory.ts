import { useDispatch, useSelector } from 'react-redux';
import { IStore } from '../store';
import { useEffect } from 'react';
import { fetchRooms, RoomStoreType } from '../store/roomStore';
import { STATUS } from '../constants/api';
import {
	fetchRoomsAccommodationsHistory,
	RoomsAccommodationsHistoryStore,
	RoomsAccommodationsStoreType,
} from '../store/roomsAccommodationsStore';
import { equalsDates } from '../utils/equals';

export const useRoomsAccommodationsHistory: (startDate: Date, endDate: Date) => RoomsAccommodationsStoreType = (startDate, endDate) => {
	const historyStore: RoomsAccommodationsStoreType = useSelector((store: IStore) => store.roomsAccommodationsHistory);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (historyStore.status === STATUS.ERROR) return;
		if (historyStore.status === STATUS.LOADING || !equalsDates(historyStore.startDate, startDate) || !equalsDates(historyStore.endDate, endDate)) {
			dispatch(fetchRoomsAccommodationsHistory({ startDate, endDate }));
		}
	}, [dispatch, startDate, endDate, historyStore.status]);
	
	return historyStore;
};
