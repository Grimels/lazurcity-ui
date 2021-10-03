import React from 'react';
import {
    Button,
    CardActions,
    CardContent,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    Typography
} from '@material-ui/core';
import { calculateTotalPriceText, renderFromDatePicker, renderToDatePicker } from '../utils';
import { useForm } from 'react-hook-form';
import { addDays, differenceInDays, subDays } from 'date-fns';
import { CreateAccommodationProps } from '../AccommodationModal';

export const CreateAccommodationForm: React.FC<CreateAccommodationProps> = (props) => {
    const calculateMaxDate = () => (props.nextAccommodationDate && differenceInDays(props.nextAccommodationDate, props.day) < 3)
        ? props.nextAccommodationDate
        : addDays(props.day, 3);
    const {register, handleSubmit, watch, control, formState: {errors}} = useForm({
        defaultValues: {
            fromDate: props.day,
            toDate: calculateMaxDate(),
            quantity: 2,
            price: 100,
            clientName: '',
            clientPhoneNumber: '',
        }
    });
    const {clientName, clientPhoneNumber, fromDate, toDate, quantity, price} = watch();

    const onSave = async () => {
        props.createAccommodation({
            roomId: props.roomId,
            clientName,
            clientPhoneNumber,
            startDate: fromDate,
            endDate: toDate,
            quantity: Number(quantity),
            price: Number(price),
        });
    }

    const getErrors = (fieldName: 'toDate' | 'fromDate' | 'quantity' | 'price' | 'clientName' | 'clientPhoneNumber') =>
        errors && errors[fieldName];

    console.log(props)
    return (
        <form onSubmit={handleSubmit(onSave)}>
            <CardContent>
                <Typography variant="h4">Создать заселение в комнате {props.roomName}</Typography>

                <div className="create-accommodation-form">
                    <div className="input-column">
                        <FormControl className="input-item">
                            {renderFromDatePicker(control, {
                                label: 'Дата Начала',
                                required: true,
                                maxDate: subDays(toDate, 1)
                            })}
                        </FormControl>
                        <FormControl className="input-item">
                            <InputLabel htmlFor="clientName">Клиент</InputLabel>
                            <Input id="clientName"
                                   className="row-input"
                                   type="text"
                                   error={!!getErrors('clientName')}
                                   {...register("clientName", {required: true, minLength: 3})}
                            />
                            {!!getErrors('clientName') &&
                            <FormHelperText id="clientName-helper" error>Обязательное поле.</FormHelperText>}
                        </FormControl>
                        <FormControl className="input-item">
                            <InputLabel htmlFor="quantity">Количество</InputLabel>
                            <Input id="quantity"
                                   className="row-input"
                                   type="number"
                                   error={!!getErrors('quantity')}
                                   {...register("quantity", {required: true, min: 1})}
                            />
                            {!!getErrors('quantity') && (
                                getErrors('quantity')?.type === 'min'
                                    ? <FormHelperText id="quantity-helper" error>Значение не может быть меньше
                                        1.</FormHelperText>
                                    : <FormHelperText id="quantity-helper" error>Обязательное поле.</FormHelperText>
                            )}
                        </FormControl>
                    </div>
                    <div className="input-column">
                        <FormControl className="input-item">
                            {renderToDatePicker(control, {
                                label: 'Дата Окончания',
                                required: true,
                                isDisabled: !fromDate,
                                minDate: addDays(fromDate, 1),
                                maxDate: props.nextAccommodationDate,
                            })}
                        </FormControl>
                        <FormControl className="input-item">
                            <InputLabel htmlFor="clientPhoneNumber">Номер Телефона</InputLabel>
                            <Input id="clientPhoneNumber"
                                   className="row-input"
                                   type="text"
                                   error={!!getErrors('clientPhoneNumber')}
                                   {...register("clientPhoneNumber", {required: true, minLength: 5})}
                            />
                            {!!getErrors('clientPhoneNumber') &&
                            <FormHelperText id="clientPhoneNumber-helper" error>Обязательное поле.</FormHelperText>}
                        </FormControl>
                        <FormControl className="input-item">
                            <InputLabel htmlFor="price">Цена (за номер/сутки)</InputLabel>
                            <Input id="price"
                                   className="row-input"
                                   type="number"
                                   error={!!getErrors('price')}
                                   {...register("price", {required: true, min: 0})}
                            />
                            {!!getErrors('price') &&
                            <FormHelperText id="price-helper" error>Обязательное поле.</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <Typography variant="caption"
                            className="calculation">{calculateTotalPriceText(fromDate, toDate, price)}</Typography>
            </CardContent>
            <CardActions className="create-actions">
                <Button color="default" onClick={props.onClose}>Отмена</Button>
                <Button color="primary" variant="contained" type="submit">Создать</Button>
            </CardActions>
        </form>
    )
}