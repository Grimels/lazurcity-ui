import * as React from 'react';
import { Calendar } from '../Calendar';

import './CalendarNavigation.scss';

export const CalendarNavigation: React.FC = () => {
	const startDate = new Date(2021, 5, 1);
	const endDate = new Date(2021, 8, 30);
	return (
		<div className="calendar-view">
			<div className="navigation">
				<h2 className="year">Сезон {2021}</h2>
			</div>
			<Calendar startDate={startDate} endDate={endDate} />
		</div>
	)
}