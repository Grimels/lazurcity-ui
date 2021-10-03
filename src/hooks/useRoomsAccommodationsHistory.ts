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

export interface UpdateAccommodationActionProps {
    accommodationId: number,
    startDate: Date,
    endDate: Date,
    quantity: number,
    price: number
}

export interface CreateAccommodationActionProps {
    roomId: number,
    clientName: string,
    clientPhoneNumber: string,
    startDate: Date,
    endDate: Date,
    quantity: number,
    price: number
}

export const useRoomsAccommodationsHistory: (startDate: Date, endDate: Date) => {
    store: RoomsAccommodationsStoreType,
    refresh: () => void,
    createAccommodation: (props: CreateAccommodationActionProps) => void,
    updateAccommodation: (props: UpdateAccommodationActionProps) => void,
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

    const refresh = () => dispatch(fetchRoomsAccommodationsHistory({startDate, endDate}));
    const updateAccommodation: (props: UpdateAccommodationActionProps) => void = ({
                                                                                accommodationId,
                                                                                startDate,
                                                                                endDate,
                                                                                quantity,
                                                                                price
                                                                            }) =>
        dispatch(updateRoomAccommodation({
            accommodationId,
            startDate,
            endDate,
            quantity,
            price
        }));
    const createAccommodation: (props: CreateAccommodationActionProps) => void = ({
                                                                                roomId,
                                                                                clientName,
                                                                                clientPhoneNumber,
                                                                                startDate,
                                                                                endDate,
                                                                                quantity,
                                                                                price,
                                                                            }) =>
        dispatch(createRoomAccommodation({
            roomId,
            clientName,
            clientPhoneNumber,
            startDate,
            endDate,
            quantity,
            price,
        }));
    const deleteAccommodation: (accommodationId: number) => void = (accommodationId) =>
        dispatch(deleteRoomAccommodation(accommodationId));
    return {refresh, createAccommodation, updateAccommodation, deleteAccommodation, store};
};
