import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Table } from '@material-ui/core';

import './Calendar.scss';
import { STATUS } from '../../constants/api';
import { eachDayOfInterval } from "date-fns";
import { CalendarTableHead } from './CalendarTableHead';
import { useRoomsAccommodationsHistory } from '../../hooks/useRoomsAccommodationsHistory';
import { CalendarTableBody } from './CalendarTableBody';
import { Alert } from '@material-ui/lab';
import { useClients } from '../../hooks/useClients';

export interface CalendarProps {
    startDate: Date,
    endDate: Date,
}

export const Calendar: React.FC<CalendarProps> = ({startDate, endDate}) => {
    useClients();
    const {
        store: roomsAccommodationsHistory,
        createAccommodation,
        updateAccommodation,
        deleteAccommodation,
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
            return  <Alert severity="error">{roomsAccommodationsHistory.error}</Alert>
        default:
            return (
                <div className="table-wrapper">
                    <Table>
                        <CalendarTableHead year={startDate.getFullYear()} dayRange={dayRange}
                                           currentDayRef={currentDayRef}/>
                        <CalendarTableBody createAccommodation={createAccommodation}
                                           updateAccommodation={updateAccommodation}
                                           deleteAccommodation={deleteAccommodation} dayRange={dayRange}
                                           startDate={startDate} endDate={endDate} history={roomsAccommodationsHistory}/>
                    </Table>
                </div>
            );
    }
}
