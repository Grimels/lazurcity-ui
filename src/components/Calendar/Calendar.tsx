import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Table } from '@material-ui/core';

import './Calendar.scss';
import { eachDayOfInterval } from "date-fns";
import { CalendarTableHead } from './CalendarTableHead';
import { CalendarTableBody } from './CalendarTableBody';
import { IRoomProjection } from '../../types/room';
import { AccommodationInfo } from '../../types/accommodation';
import { RoomsAccommodationsHistoryStore } from '../../store/roomsAccommodationsStore';

export interface CalendarProps {
    startDate: Date,
    endDate: Date,
    history: RoomsAccommodationsHistoryStore,
    onEmptyCellClick: (day: Date, dateLimit: Date, room: IRoomProjection) => void,
    onAccommodationClick: (accommodation: AccommodationInfo, dateLimit: Date, room: IRoomProjection) => void,
}

export const Calendar: React.FC<CalendarProps> = (props) => {
    const currentDayRef = React.createRef<HTMLTableHeaderCellElement>();
    useEffect(() => {
        currentDayRef?.current?.scrollIntoView({inline: 'center'});
    }, [currentDayRef.current])

    const dayRange: Array<Date> = useMemo(() => (eachDayOfInterval({
        start: props.startDate,
        end: props.endDate
    })), [props]);

    return (
        <div className="table-wrapper">
            <Table>
                <CalendarTableHead year={props.startDate.getFullYear()} dayRange={dayRange} currentDayRef={currentDayRef}/>
                <CalendarTableBody dayRange={dayRange} {...props} />
            </Table>
        </div>
    );
}
