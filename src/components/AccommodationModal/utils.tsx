import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { differenceInDays } from 'date-fns';

export interface FormDateProps {
    label: string,
    required?: boolean,
    name: string,
}

export interface FormStartDateProps extends FormDateProps{
    maxDate: Date,
}

export interface FormEndDateProps extends FormDateProps {
    minDate: Date,
    maxDate?: Date,
    isDisabled: boolean,
}

export type AccommodationFormControl = Control<{ [key: string]: string | number | Date | boolean }, object>
type AccommodationDateFormControl = Control<{ [key: string]: string | number | Date }, object>

export const renderFromDatePicker = (control: AccommodationFormControl, props: FormStartDateProps) => (
    <Controller
        name={props.name}
        control={control as AccommodationDateFormControl}
        rules={{required: props.required}}
        render={(date) => (
            <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="from-input"
                variant="inline"
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
        name={props.name}
        control={control as AccommodationDateFormControl}
        rules={{required: props.required}}
        render={(date) => (
            <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="to-input"
                variant="inline"
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
    return `${diffInDays} (дней) * ${price} (грн/день) = ${diffInDays * price} грн`;
}
