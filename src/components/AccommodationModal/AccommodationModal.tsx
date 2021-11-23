import React, { useState } from "react";
import { Button, Card, CardActions, Modal, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import './AccommodationModal.scss';
import { AccommodationConfig, getConfig } from './config';
import { AccommodationInfo, RawAccommodationInfo } from '../../types/accommodation';
import { addDays, differenceInDays } from 'date-fns';
import { AccommodationForm } from './AccommodationForm';

interface AccommodationModalProps {
    type: 'create' | 'update',
    open: boolean;
    onClose: () => void;
    roomName: string;
    roomId: number;
    dateLimit: Date;
}

export interface CreateAccommodationProps extends AccommodationModalProps {
    type: 'create',
    day: Date;
    createAccommodation: (props: Partial<RawAccommodationInfo>) => void,
}

export interface UpdateAccommodationProps extends AccommodationModalProps {
    type: 'update',
    accommodation: AccommodationInfo,
    updateAccommodation: (props: Partial<RawAccommodationInfo>) => void,
    deleteAccommodation: (accommodationId: number) => void,
}

export const AccommodationModal: React.FC<CreateAccommodationProps | UpdateAccommodationProps> = (props) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

    const getCreateConfig = (createProps: CreateAccommodationProps) => getConfig({
        type: 'create',
        CONFIRM: createProps.createAccommodation,
        CANCEL: createProps.onClose,
        defaultProps: {
            startDate: createProps.day,
            endDate: differenceInDays(createProps.dateLimit, createProps.day) >= 3
                ? addDays(createProps.day, 3)
                : createProps.dateLimit
        }
    });
    const getUpdateConfig = (updateProps: UpdateAccommodationProps) => getConfig({
        type: 'update',
        CONFIRM: (accommodationData) =>
            updateProps.updateAccommodation({ id: updateProps.accommodation.id, ...accommodationData }),
        CANCEL: updateProps.onClose,
        DELETE: () => setConfirmationModalOpen(true),
        accommodation: updateProps.accommodation,
    });

    const config: AccommodationConfig = props.type === 'create' ? getCreateConfig(props) : getUpdateConfig(props);

    return (
        <>
            <Modal open={props.open} onClose={props.onClose} className="accommodation-modal">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Card className="creation-card">
                        <AccommodationForm config={config} roomId={props.roomId} roomName={props.roomName} dateLimit={props.dateLimit} />
                    </Card>
                </MuiPickersUtilsProvider>
            </Modal>
            {props.type === 'update' &&
                <Modal open={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)}>
                    <Card className="confirmation-card">
                        <Typography>Пожалуйста, подтвердите удаление заселения:</Typography>
                        <CardActions className="create-actions">
                            <Button color="default" onClick={() => setConfirmationModalOpen(false)}>Нет</Button>
                            <Button color="primary" variant="contained"
                                    onClick={() => props.deleteAccommodation(props.accommodation.id)}>Да</Button>
                        </CardActions>
                    </Card>
                </Modal>
            }
        </>
    )
}
