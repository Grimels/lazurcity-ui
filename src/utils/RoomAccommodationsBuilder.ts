import { AccommodationInfo, IAccommodation } from '../types/accommodation';
import { differenceInDays } from 'date-fns';

export const toAccommodationInfo = (accommodation: IAccommodation): AccommodationInfo => {
    return {
        client: accommodation.client,
        startDate: accommodation.startDate,
        endDate: accommodation.endDate,
        id: accommodation.id,
        quantity: accommodation.quantity,
        price: accommodation.price,
        roomId: accommodation.room.id,
        roomName: accommodation.room.name,
        daysLeft: differenceInDays(accommodation.endDate, accommodation.startDate),
        comment: accommodation.comment,
    }
}
