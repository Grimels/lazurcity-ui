import { Control, Controller } from 'react-hook-form';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';
import { differenceInDays } from 'date-fns';

export interface FormDateProps {
    label: string,
    required?: boolean,
}

export interface FormStartDateProps extends FormDateProps{
    maxDate: Date,
}

export interface FormEndDateProps extends FormDateProps {
    minDate: Date,
    maxDate?: Date,
    isDisabled: boolean,
}

export type AccommodationFormControl = Control<{ fromDate: Date; toDate: Date; quantity: number; price: number; clientName: string; clientPhoneNumber: string; }, object>

export const renderFromDatePicker = (control: AccommodationFormControl, props: FormStartDateProps) => (
    <Controller
        name="fromDate"
        control={control}
        rules={{required: props.required}}
        render={(date) => (
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="from-input"
                maxDate={props.maxDate}
                label={props.label}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                {...date.field}
            />
        )}
    />
);

export const renderToDatePicker = (control: AccommodationFormControl, props: FormEndDateProps) => (
    <Controller
        name="toDate"
        control={control}
        rules={{required: props.required}}
        render={(date) => (
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="to-input"
                label={props.label}
                minDate={props.minDate}
                maxDate={props.maxDate}
                disabled={props.isDisabled}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                {...date.field}
            />
        )}
    />
);

export const calculateTotalPriceText = (fromDate: Date, toDate: Date, price: number) => {
    const diffInDays = differenceInDays(toDate, fromDate);
    return `${diffInDays} дней * ${price} грн = ${diffInDays * price} грн`;
}
