import * as React from 'react';
import { useState } from 'react';
import { Calendar } from '../Calendar';
import { SEASON } from '../../constants/date';

import './CalendarSection.scss';
import {
    AccommodationModal,
    AccommodationModalCreateProps,
    AccommodationModalUpdateProps
} from '../AccommodationModal';
import { useRoomsAccommodationsHistory } from '../../hooks/useRoomsAccommodationsHistory';
import { STATUS } from '../../constants/api';
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AccommodationInfo, RawAccommodationInfo } from '../../types/accommodation';
import { IRoom, IRoomProjection } from '../../types/room';

export const CalendarSection: React.FC = () => {
    const [modalProps, setModalProps] = useState<AccommodationModalCreateProps | AccommodationModalUpdateProps>();
    const onClose = () => setModalProps(undefined);

    const {
        historyStore,
        createAccommodation: createAccommodationInStore,
        updateAccommodation: updateAccommodationInStore,
        deleteAccommodation: deleteAccommodationInStore,
    } = useRoomsAccommodationsHistory(SEASON.START, SEASON.END);

    const createAccommodation = (props: Partial<RawAccommodationInfo>) => {
        createAccommodationInStore(props);
        onClose();
    }
    const updateAccommodation = (props: Partial<RawAccommodationInfo>) => {
        updateAccommodationInStore(props);
        onClose();
    }
    const deleteAccommodation = (accommodationId: number) => {
        deleteAccommodationInStore(accommodationId);
        onClose();
    }

    const onEmptyCellClick = (day: Date, dateLimit: Date, room: IRoomProjection) =>
        setModalProps({type: 'create', day, dateLimit, room, createAccommodation});

    const onAccommodationClick = (accommodation: AccommodationInfo, dateLimit: Date, room: IRoomProjection) =>
        setModalProps({type: 'update', accommodation, dateLimit, room, updateAccommodation, deleteAccommodation});

    switch (historyStore.status) {
        default:
        case STATUS.LOADING:
            return <CircularProgress color="primary"/>;
        case STATUS.ERROR:
            const {error: {name: errorName, message: errorMessage}} = historyStore;
            return <Alert className="error-alert" severity="error">{errorName}: {errorMessage}</Alert>;
        case STATUS.SUCCESS:
            return (
                <div className="calendar-view">
                    <Calendar startDate={SEASON.START}
                              endDate={SEASON.END}
                              history={historyStore}
                              onEmptyCellClick={onEmptyCellClick}
                              onAccommodationClick={onAccommodationClick}
                    />
                    {modalProps && <AccommodationModal open={Boolean(modalProps)} onClose={onClose} {...modalProps} />}
                </div>
            )
    }


}
