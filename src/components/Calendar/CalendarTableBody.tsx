import React, { createRef } from 'react';
import * as R from 'ramda';
import { TableBody, TableCell, TableRow } from '@material-ui/core';

import { Accommodation } from './Accommodation';

import { getColorLine } from '../../utils/getColorLine';
import { isToday, isWeekEndDay } from '../../utils/dateUtils';
import { AccommodationUtils } from '../../utils/accommodationUtils';

import { RoomsAccommodationsHistoryStore } from '../../store/roomsAccommodationsStore';
import { IRoomProjection } from '../../types/room';
import { AccommodationInfo, RoomAccommodationsHistory } from '../../types/accommodation';

export interface CalendarTableBodyProps {
    dayRange: Array<Date>,
    startDate: Date,
    endDate: Date,
    history: RoomsAccommodationsHistoryStore,
    onEmptyCellClick: (day: Date, dateLimit: Date, room: IRoomProjection) => void,
    onAccommodationClick: (accommodation: AccommodationInfo, dateLimit: Date, room: IRoomProjection) => void,
}

export const CalendarTableBody: React.FC<CalendarTableBodyProps> = (props) => {
    const {dayRange, startDate, endDate, history, onEmptyCellClick, onAccommodationClick} = props;

    const renderAccommodationCell = (accommodation: AccommodationInfo, room: IRoomProjection, maxDate: Date, className: string) => {
        const cellRef: React.RefObject<HTMLTableCellElement> = createRef<HTMLTableCellElement>();
        const handleClick = () => onAccommodationClick(accommodation, maxDate, room);

        return (
            <TableCell ref={cellRef} key={accommodation.id} className={className}>
                <Accommodation referredBy={cellRef}
                               color={getColorLine(accommodation.id)}
                               accommodation={accommodation}
                               onClick={handleClick}
                />
            </TableCell>
        );
    }

    const renderTableContent = (accommodations: Array<AccommodationInfo>, room: IRoomProjection) => dayRange.map((day) => {
        const accommodation = AccommodationUtils.findAccommodation(accommodations, startDate, endDate, day);

        const cellClassName = R.pipe(
            R.concat(R.__, isWeekEndDay(day) ? ' week-end' : ''),
            R.concat(R.__, isToday(day) ? ' today' : '')
        )('accommodation-cell day-range');

        if (accommodation) {
            const maxDate: Date = AccommodationUtils
                .getNewAccommodationDateLimit(accommodations, accommodation, startDate, endDate, day);
            return renderAccommodationCell(accommodation, room, maxDate, cellClassName);
        }
        const handleClick = () => onEmptyCellClick(day, endDate, room);
        return <TableCell key={`${day.toISOString()}`} className={cellClassName} onClick={handleClick}/>;
    });

    const renderTableRoomRow = (roomHistory: RoomAccommodationsHistory) => (
        <TableRow key={roomHistory.room.id} id={`${roomHistory.room.id}`}>
            <TableCell align="center"
                       className="accommodation-cell fixed-column">{roomHistory.room.name}</TableCell>
            {roomHistory && renderTableContent(roomHistory.accommodations, roomHistory.room)}
        </TableRow>
    );

    return (
        <TableBody>
            {history.roomsHistory.map(renderTableRoomRow)}
        </TableBody>
    )
}
