import { Month } from '../types/date';

export const SEASON = {
	START: new Date(2021, 5, 1),
	END: new Date(2021, 10, 29),
	TODAY: new Date(), // new Date(2021, 6, 5)
};

export const MONTH_NUMBER_BY_NAME: { [key in Month]: number } = {
	'January':  0,
	'February': 1,
	'March':    2,
	'April':    3,
	'May':      4,
	'June':     5,
	'July':     6,
	'August':   7,
	'September':8,
	'October':  9,
	'November': 10,
	'December': 11,
};

export const MONTH_NAME_BY_NUMBER: { [key in number]: Month } = {
	0: 'January',
	1: 'February',
	2: 'March',
	3: 'April',
	4: 'May',
	5: 'June',
	6: 'July',
	7: 'August',
	8: 'September',
	9: 'October',
	10: 'November',
	11: 'December',
};

export const RU_MONTH_NAME_BY_NUMBER: { [key in number]: string } = {
	0: 'Январь',
	1: 'Февраль',
	2: 'Март',
	3: 'Апрель',
	4: 'Май',
	5: 'Июнь',
	6: 'Июль',
	7: 'Август',
	8: 'Сентябрь',
	9: 'Октябрь',
	10: 'Ноябрь',
	11: 'Декабрь',
};

export const MONTH: {
	[key in 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER']: Month
} = {
	JANUARY: 'January',
	FEBRUARY: 'February',
	MARCH: 'March',
	APRIL: 'April',
	MAY: 'May',
	JUNE: 'June',
	JULY: 'July',
	AUGUST: 'August',
	SEPTEMBER: 'September',
	OCTOBER: 'October',
	NOVEMBER: 'November',
	DECEMBER: 'December',
};
