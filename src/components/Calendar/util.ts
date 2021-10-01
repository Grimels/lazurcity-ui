import { isWeekEndDay } from '../../utils/dateUtils';

export const getAccommodationCellClass = (day: Date): string => 'accommodation-cell ' + (isWeekEndDay(day) ? 'week-end' : '');
