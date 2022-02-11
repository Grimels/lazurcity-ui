import { AccommodationInfo } from '../types/accommodation';
import { isAfter, isBefore } from 'date-fns';
import { equalsDates } from './equals';
import * as R from 'ramda';

const isSearchedAccommodation = (startDate: Date, endDate: Date, day: Date) => (accommodation: AccommodationInfo): boolean => {
    const accommodationStart = isBefore(accommodation.startDate, startDate) ? startDate : accommodation.startDate;
    return equalsDates(day, accommodationStart)
}

const isAccommodationIsAfter = (startDate: Date, endDate: Date, day: Date, currentAccommodation: AccommodationInfo) =>
    (comparedAccommodation: AccommodationInfo) => {
        const accommodationStart = isBefore(comparedAccommodation.startDate, startDate) ? startDate : comparedAccommodation.startDate;
        return isAfter(accommodationStart, day) && comparedAccommodation.id !== currentAccommodation?.id;
    }

const findAccommodation = (accommodations: AccommodationInfo[], startDate: Date, endDate: Date, day: Date) =>
    R.find(isSearchedAccommodation(startDate, endDate, day))(accommodations);

const findNextAccommodation = (accommodations: AccommodationInfo[], currentAccommodation: AccommodationInfo, startDate: Date, endDate: Date, day: Date) =>
    R.find(isAccommodationIsAfter(startDate, endDate, day, currentAccommodation))(accommodations);

const getNewAccommodationDateLimit = (accommodations: AccommodationInfo[], currentAccommodation: AccommodationInfo, startDate: Date, endDate: Date, day: Date): Date =>
    R.or(
        R.filter(isAccommodationIsAfter(startDate, endDate, day, currentAccommodation))(accommodations)[0]?.startDate,
        endDate,
    );

export const AccommodationUtils = {
    findNextAccommodation,
    findAccommodation,
    getNewAccommodationDateLimit,
}
