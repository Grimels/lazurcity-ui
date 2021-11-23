import React, { useEffect } from 'react';
import { useRooms } from '../../hooks/useRooms';
import { STATUS } from '../../constants/api';
import { Typography } from '@material-ui/core';
import { RoomsList } from '../RoomsList';


export const FreeRoomsListSection: React.FC = () => {
    const roomsState = useRooms();
    useEffect(() => {
        roomsState.refresh();
    }, [])

    if (roomsState.status !== STATUS.SUCCESS) {
        return <div>Loading...</div>
    }
    return (
        <div className="dashboard">
            <Typography className="section-header" variant="h2">Свободные комнаты</Typography>
            <div className="section">
                <RoomsList rooms={roomsState.freeRooms} />
            </div>
        </div>
    )
}
