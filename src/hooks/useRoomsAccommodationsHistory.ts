import { useDispatch, useSelector } from 'react-redux';
import { IStore } from '../store';
import { useEffect } from 'react';
import { STATUS } from '../constants/api';
import {
    createRoomAccommodation, deleteRoomAccommodation,
    fetchRoomsAccommodationsHistory,
    RoomsAccommodationsStoreType,
    updateRoomAccommodation,
} from '../store/roomsAccommodationsStore';
import { equalsDates } from '../utils/equals';
import { fetchRooms } from '../store/roomStore';
import { RawAccommodationInfo } from '../types/accommodation';

export interface UpdateAccommodationActionProps {
    accommodationId: number,
    startDate: Date,
    endDate: Date,
    quantity: number,
    price: number,
    clientName: string,
    clientPhoneNumber: string,
    comment: string,
}

export const useRoomsAccommodationsHistory: (startDate: Date, endDate: Date) => {
    store: RoomsAccommodationsStoreType,
    refresh: () => void,
    createAccommodation: (props: Partial<RawAccommodationInfo>) => void,
    updateAccommodation: (props: Partial<RawAccommodationInfo>) => void,
    deleteAccommodation: (accommodationId: number) => void,
} = (startDate, endDate) => {
    const store: RoomsAccommodationsStoreType = useSelector((store: IStore) => store.roomsAccommodationsHistory);
    const dispatch = useDispatch();

    useEffect(() => {
        if (store.status === STATUS.ERROR) return;
        if (store.status === STATUS.LOADING || !equalsDates(store.startDate, startDate) || !equalsDates(store.endDate, endDate)) {
            dispatch(fetchRoomsAccommodationsHistory({startDate, endDate}));
        }
    }, [dispatch, startDate, endDate, store.status]);

    const refresh = () => {
        dispatch(fetchRoomsAccommodationsHistory({startDate, endDate}));
        dispatch(fetchRooms());
    }
    const updateAccommodation: (props: Partial<RawAccommodationInfo>) => void = ({
                                                                                     id,
                                                                                     startDate,
                                                                                     endDate,
                                                                                     quantity,
                                                                                     price,
                                                                                     clientName,
                                                                                     clientPhoneNumber,
                                                                                     isFinal,
                                                                                     comment,
                                                                                 }) => {
        dispatch(updateRoomAccommodation({
            accommodationId: id,
            startDate,
            endDate,
            quantity,
            price,
            clientName,
            clientPhoneNumber,
            isFinal,
            comment,
        }));
        dispatch(fetchRooms());
    }
    const createAccommodation: (props: Partial<RawAccommodationInfo>) => void = ({
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
        dispatch(createRoomAccommodation({
            roomId,
            clientName,
            clientPhoneNumber,
            startDate,
            endDate,
            quantity,
            price,
            isFinal,
            comment,
        }));
        dispatch(fetchRooms());
    }
    const deleteAccommodation: (accommodationId: number) => void = (accommodationId) => {
        dispatch(deleteRoomAccommodation(accommodationId));
        dispatch(fetchRooms());
    }
    return {refresh, createAccommodation, updateAccommodation, deleteAccommodation, store};
};
