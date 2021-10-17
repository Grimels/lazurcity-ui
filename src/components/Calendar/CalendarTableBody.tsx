import React, { createRef, useState } from 'react';
import { AccommodationInfo, RoomAccommodationsHistory } from '../../types/accommodation';
import { getAccommodationCellClass } from './util';
import { isAfter, isBefore } from 'date-fns';
import { equalsDates } from '../../utils/equals';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { Accommodation } from './Accommodation';
import { getColorLine } from '../../utils/getColorLine';
import { AccommodationModal } from '../AccommodationModal';
import { IRoomProjection } from '../../types/room';
import { RoomsAccommodationsHistoryStore } from '../../store/roomsAccommodationsStore';
import {
    CreateAccommodationActionProps,
    UpdateAccommodationActionProps
} from '../../hooks/useRoomsAccommodationsHistory';

export interface CalendarTableBodyProps {
    dayRange: Array<Date>,
    startDate: Date,
    endDate: Date,
    history: RoomsAccommodationsHistoryStore,
    createAccommodation: (props: CreateAccommodationActionProps) => void,
    updateAccommodation: (props: UpdateAccommodationActionProps) => void,
    deleteAccommodation: (accommodationId: number) => void,
}

type AccommodationInfoType =
    {
        mode: 'create',
        day: Date,
        roomName: string,
        roomId: number,
        nextAccommodationDate?: Date,
        createAccommodation: (props: CreateAccommodationActionProps) => void,
    }
    | {
    mode: 'update',
    accommodationId: number,
    fromDate: Date,
    toDate: Date,
    nextAccommodationDate?: Date,
    quantity: number,
    price: number,
    clientName: string,
    roomName: string,
    roomId: number,
    clientPhoneNumber: string,
    comment: string,
    updateAccommodation: (props: UpdateAccommodationActionProps) => void,
    deleteAccommodation: (accommodationId: number) => void
};

export const CalendarTableBody: React.FC<CalendarTableBodyProps> = ({
                                                                        dayRange,
                                                                        startDate,
                                                                        endDate,
                                                                        history,
                                                                        updateAccommodation,
                                                                        createAccommodation,
                                                                        deleteAccommodation,
                                                                    }) => {
    const [accommodationInfo, createAccommodationInfo] =
        useState<{ open: false } | ({ open: true } & AccommodationInfoType)>({open: false});
    const closeModal = () => createAccommodationInfo({open: false});
    const handleCreation = (props: CreateAccommodationActionProps) => {
        createAccommodation(props);
        closeModal();
    }
    const handleUpdate = (props: UpdateAccommodationActionProps) => {
        updateAccommodation(props);
        closeModal();
    }
    const handleDelete = (accommodationId: number) => {
        deleteAccommodation(accommodationId);
        closeModal();
    }
    const openCreationModal = (day: Date, room: IRoomProjection, nextAccommodationDate?: Date) =>
        createAccommodationInfo({
            mode: 'create',
            day,
            nextAccommodationDate,
            roomName: room.name,
            roomId: room.id,
            open: true,
            createAccommodation: handleCreation,
        });
    const openUpdateModal = (nextAccommodationDate?: Date) => (accommodation: AccommodationInfo) =>
        createAccommodationInfo({
            mode: 'update',
            open: true,
            accommodationId: accommodation.id,
            fromDate: accommodation.startDate,
            toDate: accommodation.endDate,
            roomName: accommodation.roomName,
            roomId: accommodation.roomId,
            clientName: accommodation.client.name,
            clientPhoneNumber: accommodation.client.phoneNumber,
            quantity: accommodation.quantity,
            price: accommodation.price,
            comment: accommodation.comment,
            nextAccommodationDate,
            updateAccommodation: handleUpdate,
            deleteAccommodation: handleDelete,
        });

    const renderTableContent = (accommodations: Array<AccommodationInfo>, room: IRoomProjection) =>
        dayRange.map((day) => {
            const accommodation = accommodations.filter((accommodation) => {
                const accommodationStart = isBefore(accommodation.startDate, startDate) ? startDate : accommodation.startDate;
                return equalsDates(day, accommodationStart)
            })[0];
            const nextAccommodation = accommodations.filter((accommodationInfo) => {
                const accommodationStart = isBefore(accommodationInfo.startDate, startDate) ? startDate : accommodationInfo.startDate;
                return isAfter(accommodationStart, day) && accommodationInfo.id !== accommodation?.id;
            })[0];

            const maxDate = nextAccommodation ? nextAccommodation.startDate : endDate;

            const isToday = equalsDates(day, new Date());
            const cellClassName = `${getAccommodationCellClass(day)} ${isToday ? 'today' : ''}`;

            if (!accommodation)
                return <TableCell key={`${day.toISOString()}`}
                                  className={cellClassName}
                                  onClick={() => openCreationModal(day, room, maxDate)}/>;

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
            {history.roomsHistory.map((roomHistory) => renderTableRoomRow(roomHistory))}
            {accommodationInfo.open && <AccommodationModal onClose={closeModal} {...accommodationInfo}/>}
        </TableBody>
    )
}