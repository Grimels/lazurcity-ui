import { MONTH_NAME_BY_NUMBER, MONTH_NUMBER_BY_NAME } from '../constants/date';
import { Month } from '../types/date';

export const isWeekEndDay = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

export const isToday = (date: Date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
}

const getFormatted = (number: number) => number < 10 ? `0${number}` : `${number}`;
export const formatDate = (date: Date) => {
    const day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    if (month === 11) {
        month = 0;
        year += 1;
    } else {
        month += 1;
    }
    return `${year}-${getFormatted(month)}-${getFormatted(day)}`;
}

export const getLastDayOfMonth = (year: number, month: Month): Date => {
    const nextMonth = MONTH_NUMBER_BY_NAME[month] + 1;
    if (nextMonth > 11) return new Date(year + 1, 0, 0)
    return new Date(year, nextMonth, 0)
};

export const getNextMonth = (currentDate: Date) => {
    const nextMonth = currentDate.getMonth() + 1;
    if (nextMonth <= 11) {
        return new Date(currentDate.getFullYear(), nextMonth, currentDate.getDate());
    }
    return new Date(currentDate.getFullYear() + 1, 0, currentDate.getDate());
};

export const getNextDate = (currentDate: Date) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDateOfMonth = getLastDayOfMonth(year, MONTH_NAME_BY_NUMBER[month]).getDate();

    const nextDate = currentDate.getDate() + 1;
    if (nextDate <= lastDateOfMonth) {
        return new Date(year, month, nextDate);
    }

    const nextMonth = month + 1;
    if (nextMonth <= 11) {
        return new Date(year, nextMonth, 1);
    }

    return new Date(year + 1, 0, 1);
};
