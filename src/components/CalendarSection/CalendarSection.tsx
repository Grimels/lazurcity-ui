import * as React from 'react';
import { Calendar } from '../Calendar';
import { SEASON } from '../../constants/date';

import './CalendarSection.scss';

export const CalendarSection: React.FC = () => {
	return (
		<div className="calendar-view">
			<div className="navigation">
				<h2 className="section-header">Сезон {2021}</h2>
			</div>
			<Calendar startDate={SEASON.START} endDate={SEASON.END} />
		</div>
	)
}