import { useDispatch, useSelector } from 'react-redux';
import { IStore } from '../store';
import { useEffect } from 'react';
import { STATUS } from '../constants/api';
import { fetchRoomsAccommodationsHistory, RoomsAccommodationsStoreType, } from '../store/roomsAccommodationsStore';
import { equalsDates } from '../utils/equals';

export const useRoomsAccommodationsHistory: (startDate: Date, endDate: Date) => { store: RoomsAccommodationsStoreType, refresh: () => void } = (startDate, endDate) => {
    const store: RoomsAccommodationsStoreType = useSelector((store: IStore) => store.roomsAccommodationsHistory);
    const dispatch = useDispatch();

    useEffect(() => {
        if (store.status === STATUS.ERROR) return;
        if (store.status === STATUS.LOADING || !equalsDates(store.startDate, startDate) || !equalsDates(store.endDate, endDate)) {
            dispatch(fetchRoomsAccommodationsHistory({startDate, endDate}));
        }
    }, [dispatch, startDate, endDate, store.status]);

    const refresh = () => dispatch(fetchRoomsAccommodationsHistory({startDate, endDate}));
    return {refresh, store};
};
