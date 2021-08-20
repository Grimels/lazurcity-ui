import { useDispatch, useSelector } from 'react-redux';
import { IStore } from '../store';
import { useEffect } from 'react';
import { fetchRooms, RoomStoreType } from '../store/roomStore';
import { STATUS } from '../constants/api';

export const useRooms: () => RoomStoreType = () => {
	const roomStore: RoomStoreType = useSelector((store: IStore) => store.roomStore);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (roomStore.status === STATUS.LOADING) dispatch(fetchRooms());
	}, [dispatch, roomStore.status]);
	
	return roomStore;
};
