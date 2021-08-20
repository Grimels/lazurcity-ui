import * as React from 'react';
import { createRef, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { MONTH_NUMBER_BY_NAME } from '../../constants/date';

import './Calendar.scss';
import { Month } from '../../types/date';
import { makeDayRangeGenerator } from '../../utils/DayRangeGenerator';
import { getLastDayOfMonth, isWeekEndDay } from '../../utils/dateUtils';
import { Accommodation } from './Accommodation';
import { STATUS } from '../../constants/api';
import { getRandomColor } from '../../utils/getRandomColor';
import { AccommodationInfo, RoomAccommodationsHistory } from '../../types/accommodation';
import { useRoomsAccommodationsHistory } from '../../hooks/useRoomsAccommodationsHistory';
import { RoomsAccommodationsStoreType } from '../../store/roomsAccommodationsStore';
import { equalsDates, isDateBefore } from '../../utils/equals';

export interface CalendarProps {
	year: number,
	month: Month,
}

export const Calendar: React.FC<CalendarProps> = ({ year, month }) => {
	const startDate: Date = useMemo(() => new Date(year, MONTH_NUMBER_BY_NAME[month], 1), [year, month]);
	const endDate: Date = useMemo(() => getLastDayOfMonth(year, month), [year, month]);
	const roomsAccommodationsHistory: RoomsAccommodationsStoreType = useRoomsAccommodationsHistory(startDate, endDate);
	
	const dayRange: Array<Date> = useMemo(() => ([...makeDayRangeGenerator(startDate, endDate)]), [startDate, endDate]);
	const getAccommodationCellClass = (day: Date): string => 'accommodation-cell ' + (isWeekEndDay(day) ? 'week-end' : '');
	
	const renderTableHeadCell: () => JSX.Element = () => {
		return (
			<TableRow>
				<TableCell align="center" className="accommodation-cell"> </TableCell>
				{dayRange.map((day) =>
					<TableCell key={`room-${day.getTime()}`}
					           align="center"
					           className={getAccommodationCellClass(day)}>
						{day.getDate()}
					</TableCell>)}
			</TableRow>
		);
	}
	
	const renderTableRoomRow = (roomHistory: RoomAccommodationsHistory) => {
		const dayRange: Date[] = [...makeDayRangeGenerator(startDate, endDate)];
		const renderTableContent = (accommodations: Array<AccommodationInfo>) => {
			return dayRange.map((day, index) => {
				const cellClassName = getAccommodationCellClass(day);
				const cellRef: React.RefObject<HTMLTableCellElement> = createRef<HTMLTableCellElement>();
				
				const searchedAccommodation = accommodations.filter((accommodation) => {
					return equalsDates(day, accommodation.startDate) || (equalsDates(day, startDate) && isDateBefore(accommodation.startDate, startDate))
				})[0];
				if (!searchedAccommodation) return <TableCell key={`${day.toISOString()}`} className={cellClassName}/>;
				
				const isStartedInRange = isDateBefore(startDate, searchedAccommodation.startDate);
				const isFinishedInRange = isDateBefore(searchedAccommodation.endDate, endDate);
				
				const d1 = isStartedInRange ? searchedAccommodation.startDate : startDate;
				const d2 = isFinishedInRange ? searchedAccommodation.endDate : endDate;
				const daysLeft = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + (
					isStartedInRange ? 0 : -1
				);
				
				const accommodation = { ...searchedAccommodation, daysLeft };
				if (roomHistory.room.id === 119) console.log(roomHistory)
				return (
					<TableCell ref={cellRef} key={`${day.toISOString()}`} className={cellClassName}>
						<Accommodation referredBy={cellRef}
						               color={getRandomColor(index)}
						               accommodation={accommodation}
						/>
					</TableCell>
				);
			});
		}
		
		return (
			<TableRow key={roomHistory.room.id} id={`${roomHistory.room.id}`}>
				<TableCell align="center" className="accommodation-cell">{roomHistory.room.name}</TableCell>
				{roomHistory && renderTableContent(roomHistory.accommodations)}
			</TableRow>
		)
	}
	
	switch (roomsAccommodationsHistory.status) {
		case STATUS.LOADING:
			return <div>Loading...</div>;
		case STATUS.ERROR:
			return <div>{roomsAccommodationsHistory.error}</div>
		default:
			return (
				<Table>
					<TableHead>
						{renderTableHeadCell()}
					</TableHead>
					<TableBody>
						{roomsAccommodationsHistory.roomsHistory.map((roomHistory) => renderTableRoomRow(roomHistory))}
					</TableBody>
				</Table>
			);
	}
}
