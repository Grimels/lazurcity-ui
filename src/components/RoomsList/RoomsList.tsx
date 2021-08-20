import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import { useLanguage } from '../../hooks/useLanguage';

import { RoomTableColumnTitle, TABLE_COLUMNS } from './constants';
import { IRoom } from '../../types/room';
import { retrieveLatestAccommodation } from '../../utils/retrieveLatestAccommodation';

export interface RoomsListProps {
	rooms: IRoom[];
}

export const RoomsList: React.FC<RoomsListProps> = ({ rooms }) => {
	const { language } = useLanguage();
	const columnNames: RoomTableColumnTitle | undefined = TABLE_COLUMNS.get(language);
	if (!columnNames) throw new Error(`Language "${language}" is not allowed!`);
	
	console.log(3, rooms)
	
	const renderColumnNames = () => Object.values(columnNames)
		.map(columnName => <TableCell key={columnName} align="center">{columnName}</TableCell>);
	
	const getFreeFrom = (room: IRoom) => {
		const latestAccommodation = retrieveLatestAccommodation(room);
		return latestAccommodation ? latestAccommodation.endDate.toLocaleDateString(language) : '&#8212';
	}
	
	const renderRoomRow = (room: IRoom) => (
		<TableRow key={room.id}>
			<TableCell align="center">{room.type}</TableCell>
			<TableCell align="center">{room.name}</TableCell>
			<TableCell align="center">{getFreeFrom(room)}</TableCell>
		</TableRow>
	)
	
	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>{renderColumnNames()}</TableRow>
				</TableHead>
				<TableBody>
					{rooms.map(row => renderRoomRow(row))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}