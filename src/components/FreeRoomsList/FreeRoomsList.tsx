import React from 'react';
import { useRooms } from '../../hooks/useRooms';
import { RoomsList } from '../RoomsList';
import { STATUS } from '../../constants/api';

export const FreeRoomsList: React.FC = () => {
	const roomsState = useRooms();
	
	switch (roomsState.status) {
		case STATUS.LOADING:
			return <div>Loading...</div>;
		case STATUS.ERROR:
			return <div>{roomsState.error}</div>
		default:
			return <RoomsList rooms={roomsState.freeRooms} />;
	}
}