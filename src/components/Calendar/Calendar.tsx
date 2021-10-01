import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Table } from '@material-ui/core';

import './Calendar.scss';
import { STATUS } from '../../constants/api';
import { eachDayOfInterval } from "date-fns";
import { CalendarTableHead } from './CalendarTableHead';
import { useRoomsAccommodationsHistory } from '../../hooks/useRoomsAccommodationsHistory';
import { CalendarTableBody } from './CalendarTableBody';

export interface CalendarProps {
    startDate: Date,
    endDate: Date,
}

export const Calendar: React.FC<CalendarProps> = ({startDate, endDate}) => {
    const {
        refresh: refreshStore,
        store: roomsAccommodationsHistory
    } = useRoomsAccommodationsHistory(startDate, endDate);

    const currentDayRef = React.createRef<HTMLTableHeaderCellElement>();
    useEffect(() => {
        if (currentDayRef.current) currentDayRef.current
            .scrollIntoView(true);
    }, [])

    const dayRange: Array<Date> = useMemo(() => (eachDayOfInterval({
        start: startDate,
        end: endDate
    })), [startDate, endDate]);

    switch (roomsAccommodationsHistory.status) {
        case STATUS.LOADING:
            return <div>Loading...</div>;
        case STATUS.ERROR:
            return <div>{roomsAccommodationsHistory.error}</div>
        default:
            return (
                <div className="table-wrapper">
                    <Table>
                        <CalendarTableHead year={startDate.getFullYear()} dayRange={dayRange}
                                           currentDayRef={currentDayRef}/>
                        <CalendarTableBody dayRange={dayRange} startDate={startDate} endDate={endDate} history={roomsAccommodationsHistory} refreshHistory={refreshStore} />
                    </Table>
                </div>
            );
    }
}
