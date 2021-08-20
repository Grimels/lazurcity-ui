import { getNextDate } from './dateUtils';

const isDone = (date1: Date, date2: Date) => date1.getFullYear() > date2.getFullYear()
	|| date1.getMonth() > date2.getMonth()
	|| date1.getDate() > date2.getDate();

export function makeDayRangeGenerator(startRange: Date, endRange: Date): Generator<Date> {
	let nextDate = new Date(startRange), currentDate;
	return (function* () {
		let done = isDone(nextDate, endRange);
		while (!done) {
			currentDate = new Date(nextDate);
			nextDate = getNextDate(currentDate);
			done = isDone(nextDate, endRange);
			yield currentDate;
		}
	})();
}