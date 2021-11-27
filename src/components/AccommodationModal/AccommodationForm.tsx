import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Button,
    CardActions,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    TextField,
    Typography
} from '@material-ui/core';
import { addDays, subDays } from 'date-fns';

import { calculateTotalPriceText, renderFromDatePicker, renderToDatePicker } from './utils';
import {
    AccommodationConfig,
    AccommodationConfigActionGroup,
    AccommodationConfigInputField,
    FIELD,
    FIELD_TYPE
} from './config';
import { RawAccommodationInfo } from '../../types/accommodation';

export interface AccommodationFormProps {
    config: AccommodationConfig;
    roomName: string;
    roomId: number;
    dateLimit: Date;
}

export const AccommodationForm: React.FC<AccommodationFormProps> = ({config, roomName, roomId, dateLimit}) => {
    const defaultValues: { [key: string]: string | number | Date | boolean } = {};
    config.fields
        .forEach(row => row
            .forEach(field => defaultValues[field.name] = field.default));
    const {register, handleSubmit, watch, control, formState: {errors}} = useForm({defaultValues});
    const fields = watch();
    const getErrors = (fieldName: string) => errors && errors[fieldName];

    const renderStartDatePicker = (props: AccommodationConfigInputField) => (
        <FormControl className="input-item">
            {renderFromDatePicker(control, {
                name: props.name,
                label: props.label,
                required: props.isRequired,
                maxDate: subDays((fields[config.details.endDateName] as Date), 1)
            })}
        </FormControl>
    );

    const renderEndDatePicker = (props: AccommodationConfigInputField) => (
        <FormControl className="input-item">
            {renderToDatePicker(control, {
                name: props.name,
                label: props.label,
                required: props.isRequired,
                isDisabled: !fields['startDate'],
                minDate: addDays((fields[config.details.startDateName] as Date), 1),
                maxDate: dateLimit,
            })}
        </FormControl>
    );

    const getTextHelper = (props: AccommodationConfigInputField) => Boolean(getErrors(props.name))
        ? (getErrors(props.name).type === 'min' ? `Значение не может быть меньше ${props.min}.` : 'Обязательное поле.')
        : (props.isRequired && 'Обязательное поле.');

    const renderTextInput = (props: AccommodationConfigInputField) => (
        <FormControl className="input-item">
            <TextField id={props.name}
                       className="row-input"
                       type="text"
                       error={Boolean(getErrors(props.name))}
                       variant="outlined"
                       label={props.label}
                       helperText={getTextHelper(props)}
                       {...register(props.name, {required: props.isRequired, minLength: 3})}
            />
        </FormControl>
    );

    const renderNumberInput = (props: AccommodationConfigInputField) => (
        <FormControl className="input-item">
            <TextField id={props.name}
                       className="row-input"
                       type="number"
                       error={Boolean(getErrors(props.name))}
                       variant="outlined"
                       label={props.label}
                       helperText={getTextHelper(props)}
                       {...register(props.name, {required: props.isRequired, min: Number(props.min)})}
            />
        </FormControl>
    );

    const renderCheckBoxInput = (props: AccommodationConfigInputField) => (
        <FormControl className="input-item">
            <FormControlLabel control={<Checkbox id={props.name}
                                                 className="row-input"
                                                 defaultChecked={props.default as boolean}
                                                 {...register(props.name, {required: props.isRequired})}/>}
                              checked={Boolean(fields[FIELD.IS_FINAL])}
                              label={props.label}/>
            {!!getErrors(props.name) && ((!!getErrors(props.name) && getErrors(props.name).type === 'min') ?
                <FormHelperText id="quantity-helper" error>Значение не может быть меньше {props.min}.</FormHelperText>
                : <FormHelperText id={`${props.name}-helper`} error>Обязательное поле.</FormHelperText>)}
        </FormControl>
    );

    const renderFieldInput = (props: AccommodationConfigInputField) => {
        switch (props.type) {
            default:
            case FIELD_TYPE.TEXT:
                return renderTextInput(props);
            case FIELD_TYPE.NUMBER:
                return renderNumberInput(props);
            case FIELD_TYPE.START_DATE:
                return renderStartDatePicker(props);
            case FIELD_TYPE.END_DATE:
                return renderEndDatePicker(props);
            case FIELD_TYPE.CHECK_BOX:
                return renderCheckBoxInput(props);
        }
    }

    const renderButton = (actionConfig: { label: string; color: 'default' | 'primary' | 'secondary'; action: () => void }, isSubmit: boolean = false) => (
        <Button color={actionConfig.color} type={isSubmit ? 'submit' : 'button'}
                onClick={actionConfig.action}>{actionConfig.label}</Button>
    );

    const renderConfirmationButton = (actionConfig: { label: string; color: 'default' | 'primary' | 'secondary' }) => {
        return <Button color={actionConfig.color} variant="contained" type="submit">{actionConfig.label}</Button>;
    }

    const renderButtonGroup = (actionGroup: AccommodationConfigActionGroup) => (
        <div className={`action-group ${actionGroup.position}`}>
            {actionGroup.DELETE && renderButton(actionGroup.DELETE)}
            {actionGroup.CANCEL && renderButton(actionGroup.CANCEL)}
            {actionGroup.CONFIRM && renderConfirmationButton(actionGroup.CONFIRM)}
        </div>
    );

    const renderFieldsGroup = (group: AccommodationConfigInputField[]) =>
        <div className="input-row">{group.map(renderFieldInput)}</div>;

    const totalPriceText = calculateTotalPriceText(
        (fields[config.details.startDateName] as Date),
        (fields[config.details.endDateName] as Date),
        Number(fields[config.details.priceName]));

    const onSubmit = () => {
        const accommodationInfo: Partial<RawAccommodationInfo> = {
            clientName: String(fields[FIELD.NAME]),
            clientPhoneNumber: String(fields[FIELD.PHONE_NUMBER]),
            comment: String(fields[FIELD.COMMENT]),
            startDate: (fields[FIELD.START_DATE] as Date),
            endDate: (fields[FIELD.END_DATE] as Date),
            price: Number(fields[FIELD.PRICE]),
            quantity: Number(fields[FIELD.QUANTITY]),
            isFinal: Boolean(fields[FIELD.IS_FINAL]),
            roomId,
        };
        return config.onSubmit(accommodationInfo);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="form-content">
                <Typography className="accommodation-form-title" variant="h5">{config.getTitle(roomName)}</Typography>

                {config.fields.map(renderFieldsGroup)}

                <Typography variant="caption"
                            className="calculation">Предварительная
                    стоимость: <span>{totalPriceText}</span>.</Typography>
            </CardContent>
            <CardActions className="form-actions">
                {config.actions.map(renderButtonGroup)}
            </CardActions>

        </form>
    )
}
