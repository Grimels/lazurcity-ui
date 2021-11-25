import React, { useState } from "react";
import { Button, Card, CardActions, Modal, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import './AccommodationModal.scss';
import { AccommodationConfig, getConfig } from './config';
import { AccommodationInfo, RawAccommodationInfo } from '../../types/accommodation';
import { addDays, differenceInDays } from 'date-fns';
import { AccommodationForm } from './AccommodationForm';
import { IRoomProjection } from '../../types/room';

interface AccommodationModalProps {
    type: 'create' | 'update',

    dateLimit: Date,
    room: IRoomProjection,
}

export interface AccommodationModalCreateProps extends AccommodationModalProps {
    type: 'create',

    day: Date,
    createAccommodation: (props: Partial<RawAccommodationInfo>) => void,
}

export interface AccommodationModalUpdateProps extends AccommodationModalProps {
    type: 'update',

    accommodation: AccommodationInfo,
    updateAccommodation: (props: Partial<RawAccommodationInfo>) => void,
    deleteAccommodation: (accommodationId: number) => void
}

type AccommodationModalType = AccommodationModalCreateProps | AccommodationModalUpdateProps;

export const AccommodationModal: React.FC<AccommodationModalType & { open: boolean, onClose: () => void }> = (props) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const { room: { name: roomName, id: roomId }, dateLimit } = props;

    const getCreateConfig = (createProps: AccommodationModalCreateProps) => getConfig({
        type: 'create',
        CONFIRM: createProps.createAccommodation,
        CANCEL: props.onClose,
        defaultProps: {
            startDate: createProps.day,
            endDate: differenceInDays(createProps.dateLimit, createProps.day) >= 3
                ? addDays(createProps.day, 3)
                : createProps.dateLimit
        }
    });

    const getUpdateConfig = (updateProps: AccommodationModalUpdateProps) => getConfig({
        type: 'update',
        CONFIRM: (accommodationData) =>
            updateProps.updateAccommodation({ id: updateProps.accommodation.id, ...accommodationData }),
        CANCEL: props.onClose,
        DELETE: () => setConfirmationModalOpen(true),
        accommodation: updateProps.accommodation,
    });

    const createFormConfig: () => AccommodationConfig = () => {
        switch (props.type) {
            default:
            case 'create': return getCreateConfig(props);
            case 'update': return getUpdateConfig(props);
        }
    }

    const renderConfirmationModalForDeleteAction = (onConfirm: () => void) => (
        <Modal open={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)}>
            <Card className="confirmation-card">
                <Typography>Пожалуйста, подтвердите удаление заселения:</Typography>
                <CardActions className="create-actions">
                    <Button color="default" onClick={() => setConfirmationModalOpen(false)}>Нет</Button>
                    <Button color="primary" variant="contained"
                            onClick={onConfirm}>Да</Button>
                </CardActions>
            </Card>
        </Modal>
    );

    const createDeleteAccommodationAction = (updateProps: AccommodationModalUpdateProps) =>
        () => updateProps.deleteAccommodation(updateProps.accommodation.id)

    return (
        <>
            <Modal open={props.open} onClose={props.onClose} className="accommodation-modal">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Card className="creation-card">
                        <AccommodationForm config={createFormConfig()} roomId={roomId} roomName={roomName} dateLimit={dateLimit} />
                    </Card>
                </MuiPickersUtilsProvider>
            </Modal>
            {props.type === 'update' && renderConfirmationModalForDeleteAction(createDeleteAccommodationAction(props))}
        </>
    )
}
