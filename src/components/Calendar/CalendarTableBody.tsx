import React, { createRef, useState } from 'react';
import { AccommodationInfo, RawAccommodationInfo, RoomAccommodationsHistory } from '../../types/accommodation';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { Accommodation } from './Accommodation';
import { getColorLine } from '../../utils/getColorLine';
import { AccommodationModal } from '../AccommodationModal';
import { IRoomProjection } from '../../types/room';
import { RoomsAccommodationsHistoryStore } from '../../store/roomsAccommodationsStore';
import { useRoomsAccommodationsHistory } from '../../hooks/useRoomsAccommodationsHistory';
import { STATUS } from '../../constants/api';
import * as R from 'ramda';
import { AccommodationUtils } from '../../utils/accommodationUtils';
import { isToday, isWeekEndDay } from '../../utils/dateUtils';

export interface CalendarTableBodyProps {
    dayRange: Array<Date>,
    startDate: Date,
    endDate: Date,
    history: RoomsAccommodationsHistoryStore,
}

interface AccommodationModalProps {
    type: 'create' | 'update',

    roomName: string,
    roomId: number,
}

interface AccommodationModalCreateProps extends AccommodationModalProps {
    type: 'create',
    day: Date,
    dateLimit: Date,
    createAccommodation: (props: Partial<RawAccommodationInfo>) => void,
}

interface AccommodationModalUpdateProps extends AccommodationModalProps {
    type: 'update',
    accommodation: AccommodationInfo,
    dateLimit: Date,
    updateAccommodation: (props: Partial<RawAccommodationInfo>) => void,
    deleteAccommodation: (accommodationId: number) => void
}

export const CalendarTableBody: React.FC<CalendarTableBodyProps> = ({
                                                                        dayRange,
                                                                        startDate,
                                                                        endDate,
                                                                    }) => {
    const history = useRoomsAccommodationsHistory(startDate, endDate);

    const [accommodationInfo, createAccommodationInfo] =
        useState<{ open: false, } | ({ open: true } & (AccommodationModalCreateProps | AccommodationModalUpdateProps))>({open: false});
    const closeModal = () => createAccommodationInfo({open: false});
    const handleCreation = (props: Partial<RawAccommodationInfo>) => {
        history.createAccommodation(props);
        closeModal();
    }
    const handleUpdate = (props: Partial<RawAccommodationInfo>) => {
        history.updateAccommodation(props);
        closeModal();
    }
    const handleDelete = (accommodationId: number) => {
        history.deleteAccommodation(accommodationId);
        closeModal();
    }
    const openCreationModal = (day: Date, room: IRoomProjection, nextAccommodationDate?: Date) =>
        createAccommodationInfo({
            type: 'create',
            day,
            dateLimit: nextAccommodationDate || endDate,
            open: true,
            roomName: room.name,
            roomId: room.id,
            createAccommodation: handleCreation,
        });

    const openUpdateModal = (nextAccommodationDate?: Date) => (accommodation: AccommodationInfo) =>
        createAccommodationInfo({
            type: 'update',
            open: true,
            accommodation: accommodation,
            roomName: accommodation.roomName,
            roomId: accommodation.roomId,
            dateLimit: nextAccommodationDate || endDate,
            updateAccommodation: handleUpdate,
            deleteAccommodation: handleDelete,
        });

    const renderTableContent = (accommodations: Array<AccommodationInfo>, room: IRoomProjection) => dayRange.map((day) => {
        const accommodation = AccommodationUtils.findAccommodation(accommodations, startDate, endDate, day);

        const cellClassName = R.pipe(
            R.concat(R.__, isWeekEndDay(day) ? ' week-end' : ''),
            R.concat(R.__, isToday(day) ? ' today' : '')
        )('accommodation-cell');

        if (!accommodation)
            return <TableCell key={`${day.toISOString()}`} className={cellClassName} onClick={() => openCreationModal(day, room, endDate)}/>;

        const maxDate = AccommodationUtils.getNewAccommodationDateLimit(accommodations, accommodation, startDate, endDate, day);
        const cellRef: React.RefObject<HTMLTableCellElement> = createRef<HTMLTableCellElement>();
        return (
            <TableCell ref={cellRef} key={accommodation.id} className={cellClassName}>
                <Accommodation referredBy={cellRef}
                               color={getColorLine(accommodation.id)}
                               accommodation={accommodation}
                               onClick={openUpdateModal(maxDate)}
                />
            </TableCell>
        );
    });

    const renderTableRoomRow = (roomHistory: RoomAccommodationsHistory) => (
        <TableRow key={roomHistory.room.id} id={`${roomHistory.room.id}`}>
            <TableCell align="center"
                       className="accommodation-cell fixed-column">{roomHistory.room.name}</TableCell>
            {roomHistory && renderTableContent(roomHistory.accommodations, roomHistory.room)}
        </TableRow>
    )

    return (
        <TableBody>
            {history.store.status === STATUS.SUCCESS && history.store.roomsHistory.map((roomHistory) => renderTableRoomRow(roomHistory))}
            {(accommodationInfo.open) && <AccommodationModal onClose={closeModal} {...accommodationInfo}/>}
        </TableBody>
    )
}
