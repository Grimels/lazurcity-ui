import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    Modal,
    Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import { calculateTotalPriceText, renderFromDatePicker, renderToDatePicker } from '../utils';
import { addDays, subDays } from 'date-fns';
import { useForm } from 'react-hook-form';
import { UpdateAccommodationProps } from '../AccommodationModal';

export const UpdateAccommodationForm: React.FC<UpdateAccommodationProps> = (props) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const {register, handleSubmit, watch, control, formState: {errors}} = useForm({
        defaultValues: {
            fromDate: props.fromDate,
            toDate: props.toDate,
            quantity: props.quantity,
            price: props.price,
            clientName: props.clientName,
            clientPhoneNumber: props.clientPhoneNumber,
        }
    });
    const {fromDate, toDate, quantity, price} = watch();

    const onUpdate = async () => {
        props.updateAccommodation({
            accommodationId: props.accommodationId,
            startDate: fromDate,
            endDate: toDate,
            quantity: Number(quantity),
            price: Number(price),
        });
    }

    const confirmDelete = () => setConfirmationModalOpen(true);

    const onDelete = async () => props.deleteAccommodation(props.accommodationId);

    const getErrors = (fieldName: 'toDate' | 'fromDate' | 'quantity' | 'price' | 'clientName' | 'clientPhoneNumber') =>
        errors && errors[fieldName];

    console.log(props)
    return (
        <form onSubmit={handleSubmit(onUpdate)}>
            <CardContent>
                <Typography variant="h4">Редактировать заселение в комнате {props.roomName}</Typography>

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
                <Button color="secondary" onClick={confirmDelete}>Удалить</Button>
                <div>
                    <Button color="default" onClick={props.onClose}>Отмена</Button>
                    <Button color="primary" variant="contained" type="submit">Обновить</Button>
                </div>
            </CardActions>
            <Modal open={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)}>
                <Card className="confirmation-card">
                    <Typography>Пожалуйста, подтвердите удаление заселения:</Typography>
                    <CardActions className="create-actions">
                        <Button color="default" onClick={() => setConfirmationModalOpen(false)}>Нет</Button>
                        <Button color="primary" variant="contained" onClick={onDelete}>Да</Button>
                    </CardActions>
                </Card>
            </Modal>
        </form>
    )
}