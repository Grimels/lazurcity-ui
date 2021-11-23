import React from 'react';
import { IRoom } from '../../types/room';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { format, isAfter } from 'date-fns';

export interface RoomsListProps {
    rooms: IRoom[],
}

export const RoomsList: React.FC<RoomsListProps> = ({ rooms }) => {
    const findLatestAccommodation = (room: IRoom) => {
        if (!room.accommodations) return;

        let latestAccommodation = room.accommodations[0];
        room.accommodations
            .forEach(accommodation => {
                if (isAfter(accommodation.startDate, latestAccommodation.startDate)) latestAccommodation = accommodation;
            });
        return latestAccommodation;
    }

    const renderRoomRow = () => rooms.map(room => {
        const latestAccommodation = findLatestAccommodation(room);
        return (
            <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{latestAccommodation ? latestAccommodation.quantity : '-'}</TableCell>
                <TableCell>{latestAccommodation ? format(latestAccommodation.endDate, 'dd.MM.yyyy') : '-'}</TableCell>
            </TableRow>
        )
    })

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Номер</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Количество людей</TableCell>
                    <TableCell>Свободна с</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {renderRoomRow()}
            </TableBody>
        </Table>
    )
}
