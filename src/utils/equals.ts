export const equalsDates = (date1: Date, date2: Date) => (
	date1.getFullYear() === date2.getFullYear()
	&& date1.getMonth() === date2.getMonth()
	&& date1.getDate() === date2.getDate()
);

export const dateInRange = (date: Date, start: Date, end: Date) => (
	start.getFullYear() <= date.getFullYear() && end.getFullYear() >= date.getFullYear()
	&& start.getMonth() <= date.getMonth() && end.getMonth() >= date.getMonth()
	&& start.getDate() <= date.getDate() && end.getDate() >= date.getDate()
);

export const isDateBefore = (date: Date, comparedDate: Date) =>
	(date.getFullYear() <= comparedDate.getFullYear() && date.getMonth() <= comparedDate.getMonth() && date.getDate() < comparedDate.getDate())
	|| (date.getFullYear() <= comparedDate.getFullYear() && date.getMonth() < comparedDate.getMonth())
	|| (date.getFullYear() < comparedDate.getFullYear());

