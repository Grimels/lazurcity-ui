import React, { useEffect } from 'react';
import { useRooms } from '../../hooks/useRooms';
import { STATUS } from '../../constants/api';
import { Typography } from '@material-ui/core';
import { RoomsList } from '../RoomsList';


export const BusyRoomsListSection: React.FC = () => {
    const roomsState = useRooms();
    useEffect(() => {
        roomsState.refresh();
    }, [])

    if (roomsState.status !== STATUS.SUCCESS) {
        return <div>Loading...</div>
    }
    return (
        <div className="dashboard">
            <Typography className="section-header" variant="h2">Занятые комнаты</Typography>
            <div className="section">
                <RoomsList rooms={roomsState.busyRooms} />
            </div>
        </div>
    )
}
