import React from 'react';
import { TableCell, TableHead, TableRow } from '@material-ui/core';
import { lastDayOfMonth } from 'date-fns';
import { RU_MONTH_NAME_BY_NUMBER } from '../../constants/date';
import { equalsDates } from '../../utils/equals';
import { getAccommodationCellClass } from './util';

export interface CalendarTableHeadProps {
    year: number,
    dayRange: Array<Date>,
    currentDayRef: React.RefObject<HTMLTableHeaderCellElement>,
}

export const CalendarTableHead: React.FC<CalendarTableHeadProps> = ({ year, dayRange, currentDayRef }) => {

    const renderTableHeadMonths: () => JSX.Element = () => {
        const monthSet = [...new Set(dayRange.map(day => day.getMonth()))];
        return (
            <TableRow>
                <TableCell align="center" className="accommodation-cell"> </TableCell>
                {monthSet.map((month) => {
                    const defaultDate = new Date(year, month);
                    return (
                        <TableCell key={`month-${month}`}
                                   align="center"
                                   className='accommodation-cell month'
                                   colSpan={lastDayOfMonth(defaultDate).getDate()}>
                            {RU_MONTH_NAME_BY_NUMBER[month]}
                        </TableCell>
                    )
                })}
            </TableRow>
        );
    }

    const renderTableHeadCell: () => JSX.Element = () => {
        return (
            <TableRow>
                <TableCell align="center" className="accommodation-cell fixed-column"> </TableCell>
                {dayRange.map((day, index) => {
                    const isToday = equalsDates(day, new Date());

                    return (
                        <TableCell key={`room-${day.getTime()}`}
                                   align="center"
                                   ref={isToday ? currentDayRef : undefined}
                                   data-tableIndex={index}
                                   className={`${getAccommodationCellClass(day)} ${isToday ? 'today' : ''}`}>
                            {day.getDate()}
                        </TableCell>
                    )
                })}
            </TableRow>
        );
    }

    return (
        <TableHead>
            {renderTableHeadMonths()}
            {renderTableHeadCell()}
        </TableHead>
    );
}