import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { CircularProgress, Table } from '@material-ui/core';

import './Calendar.scss';
import { STATUS } from '../../constants/api';
import { eachDayOfInterval } from "date-fns";
import { CalendarTableHead } from './CalendarTableHead';
import { useRoomsAccommodationsHistory } from '../../hooks/useRoomsAccommodationsHistory';
import { CalendarTableBody } from './CalendarTableBody';
import { useClients } from '../../hooks/useClients';
import { Alert } from '@material-ui/lab';

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
        currentDayRef?.current?.scrollIntoView({inline: 'center'});
    }, [currentDayRef.current])

    const dayRange: Array<Date> = useMemo(() => (eachDayOfInterval({
        start: startDate,
        end: endDate
    })), [startDate, endDate]);

    switch (roomsAccommodationsHistory.status) {
        case STATUS.LOADING:
            return <CircularProgress color="primary"/>;
        case STATUS.ERROR:
            return (
                <Alert className="error-alert" severity="error">
                    {roomsAccommodationsHistory.error.name}: {roomsAccommodationsHistory.error.message}
                </Alert>);
        default:
            const calendarTableProps = {
                createAccommodation,
                updateAccommodation,
                deleteAccommodation,

                dayRange,
                startDate,
                endDate,
                history: roomsAccommodationsHistory,
            }
            return (
                <div className="table-wrapper">
                    <Table>
                        <CalendarTableHead year={startDate.getFullYear()} dayRange={dayRange}
                                           currentDayRef={currentDayRef}/>
                        <CalendarTableBody {...calendarTableProps} />
                    </Table>
                </div>
            );
    }
}
