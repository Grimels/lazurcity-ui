import React from "react";
import { Card, Modal } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import './AccommodationModal.scss';
import { CreateAccommodationForm } from './CreateAccommodationForm';
import { UpdateAccommodationForm } from './UpdateAccommodationForm';
import {
    CreateAccommodationActionProps,
    UpdateAccommodationActionProps
} from '../../hooks/useRoomsAccommodationsHistory';

interface AccommodationModalProps {
    mode: 'create' | 'update',
    open: boolean;
    onClose: () => void;
    roomName: string;
    roomId: number;
    nextAccommodationDate?: Date;
}

export interface CreateAccommodationProps extends AccommodationModalProps {
    mode: 'create',
    day: Date;
    createAccommodation: (props: CreateAccommodationActionProps) => void,
}

export interface UpdateAccommodationProps extends AccommodationModalProps {
    mode: 'update',
    accommodationId: number,
    fromDate: Date;
    toDate: Date;
    quantity: number;
    price: number;
    clientName: string;
    clientPhoneNumber: string;
    comment: string;
    updateAccommodation: (props: UpdateAccommodationActionProps) => void,
    deleteAccommodation: (accommodationId: number) => void,
}

export const AccommodationModal: React.FC<CreateAccommodationProps | UpdateAccommodationProps> = (props) => {
    const renderForm = () => {
        if (props.mode === 'create') {
            return <CreateAccommodationForm {...props} />
        }
        return <UpdateAccommodationForm {...props} />
    }

    return (
        <Modal open={props.open} onClose={props.onClose} className="creation-modal">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Card className="creation-card">
                    {renderForm()}
                </Card>
            </MuiPickersUtilsProvider>
        </Modal>
    )
}