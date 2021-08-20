import * as React from 'react';
import { useState } from 'react';
import { Calendar } from '../Calendar';
import { MONTH_NAME_BY_NUMBER, RU_MONTH_NAME_BY_NUMBER } from '../../constants/date';

import './CalendarNavigation.scss';
import { useLanguage } from '../../hooks/useLanguage';
import { RU } from '../../constants/language';

export const CalendarNavigation: React.FC = () => {
	const { language } = useLanguage();
	const currentDate = new Date();
	const [{ month, year }, setDate] = useState({ month: currentDate.getMonth(), year: currentDate.getFullYear() });
	const setMonth = (monthNumber: number) => {
		if (monthNumber < 0) {
			setDate(prevState => ({ ...prevState, year: prevState.year - 1, month: 11}));
		} else if (monthNumber > 11) {
			setDate(prevState => ({ ...prevState, year: prevState.year + 1, month: 0}));
		}else {
			setDate(prevState => ({ ...prevState, month: monthNumber}));
		}
	}
	
	console.log(year, month)
	return (
		<div className="calendar-view">
			<div className="navigation">
				<button className="prev-month" onClick={() => setMonth(month - 1)}>{'<'}</button>
				<h2 className="year">{language === RU ? RU_MONTH_NAME_BY_NUMBER[month] : MONTH_NAME_BY_NUMBER[month]} {year}</h2>
				<button className="next-month" onClick={() => setMonth(month + 1)}>{'>'}</button>
			</div>
			<Calendar year={year} month={MONTH_NAME_BY_NUMBER[month]} />
		</div>
	)
}