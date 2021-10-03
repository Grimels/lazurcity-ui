import { API } from '../constants/api';
import { ResponseParser } from '../utils/parseResponseModel';
import { AccommodationsStatistics, IAccommodation, RoomAccommodationsHistory } from '../types/accommodation';
import { formatDate } from '../utils/dateUtils';


const getRoomAccommodationsHistory: (startDate: Date, endDate: Date) => Promise<RoomAccommodationsHistory[]> = (startDate, endDate) =>
    fetch(`${API}/accommodations/history/from/${formatDate(startDate)}/to/${formatDate(endDate)}`)
        .then(response => response.json())
        .then(roomsHistory => (roomsHistory as RoomAccommodationsHistory[])
            .map((roomHistory) => ResponseParser.parseAccommodationsHistory(roomHistory)),
        );

const createAccommodation: (roomId: number,
                            clientName: string,
                            clientPhoneNumber: string,
                            startDate: Date,
                            endDate: Date,
                            quantity: number,
                            price: number) => Promise<IAccommodation> = (roomId, clientName, clientPhoneNumber, startDate, endDate, quantity, price) => {
    const requestBody = {
        roomId,
        clientName,
        clientPhoneNumber,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        quantity,
        price,
        isFinal: true
    };
    return fetch(`${API}/accommodations`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .then(accommodation => ResponseParser.parseAccommodation(accommodation));
}

const updateAccommodation: (accommodationId: number,
                            startDate: Date,
                            endDate: Date,
                            quantity: number,
                            price: number) => void = (accommodationId, startDate, endDate, quantity, price) => {
    const requestBody = {startDate: formatDate(startDate), endDate: formatDate(endDate), quantity, price};
    return fetch(`${API}/accommodations/${accommodationId}`, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
        headers: {'Content-Type': 'application/json'}
    });
}

const deleteAccommodation: (accommodationId: number) => void = (accommodationId) =>
    fetch(`${API}/accommodations/${accommodationId}`, {method: 'DELETE'});

const getAccommodationsStatistics: (startDate: Date, endDate: Date, date: Date) => Promise<AccommodationsStatistics> = (startDate, endDate, date) =>
    fetch(`${API}/accommodations/statistics/from/${formatDate(startDate)}/to/${formatDate(endDate)}?date=${formatDate(date)}`)
        .then(response => response.json())
        .then(statistics => ResponseParser.parseAccommodationsStatistics(statistics));

export const AccommodationsDataService = {
    getRoomAccommodationsHistory,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    getAccommodationsStatistics,
};