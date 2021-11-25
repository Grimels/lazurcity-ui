import React, { createRef } from 'react';
import { AccommodationInfo, RoomAccommodationsHistory } from '../../types/accommodation';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { Accommodation } from './Accommodation';
import { getColorLine } from '../../utils/getColorLine';
import { IRoomProjection } from '../../types/room';
import { RoomsAccommodationsHistoryStore } from '../../store/roomsAccommodationsStore';
import { STATUS } from '../../constants/api';
import * as R from 'ramda';
import { AccommodationUtils } from '../../utils/accommodationUtils';
import { isToday, isWeekEndDay } from '../../utils/dateUtils';

export interface CalendarTableBodyProps {
    dayRange: Array<Date>,
    startDate: Date,
    endDate: Date,
    history: RoomsAccommodationsHistoryStore,
    onEmptyCellClick: (day: Date, dateLimit: Date, room: IRoomProjection) => void,
    onAccommodationClick: (accommodation: AccommodationInfo, dateLimit: Date, room: IRoomProjection) => void,
}

export const CalendarTableBody: React.FC<CalendarTableBodyProps> = (props) => {
    const { dayRange, startDate, endDate, history, onEmptyCellClick, onAccommodationClick } = props;

    const renderTableContent = (accommodations: Array<AccommodationInfo>, room: IRoomProjection) => dayRange.map((day) => {
        const accommodation = AccommodationUtils.findAccommodation(accommodations, startDate, endDate, day);

        const cellClassName = R.pipe(
            R.concat(R.__, isWeekEndDay(day) ? ' week-end' : ''),
            R.concat(R.__, isToday(day) ? ' today' : '')
        )('accommodation-cell');

        if (!accommodation) {
            const handleClick = () => onEmptyCellClick(day, endDate, room);
            return <TableCell key={`${day.toISOString()}`} className={cellClassName} onClick={handleClick}/>;
        }

        const maxDate = AccommodationUtils.getNewAccommodationDateLimit(accommodations, accommodation, startDate, endDate, day);
        const cellRef: React.RefObject<HTMLTableCellElement> = createRef<HTMLTableCellElement>();
        const handleClick = () => onAccommodationClick(accommodation, maxDate, room);

        return (
            <TableCell ref={cellRef} key={accommodation.id} className={cellClassName}>
                <Accommodation referredBy={cellRef}
                               color={getColorLine(accommodation.id)}
                               accommodation={accommodation}
                               onClick={handleClick}
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
    );

    return (
        <TableBody>
            {history.roomsHistory.map(renderTableRoomRow)}
        </TableBody>
    )
}
