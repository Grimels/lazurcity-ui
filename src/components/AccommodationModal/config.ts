import { AccommodationInfo, RawAccommodationInfo } from '../../types/accommodation';

export const FIELD = {
    START_DATE: 'startDate',
    END_DATE: 'endDate',
    NAME: 'clientName',
    PHONE_NUMBER: 'clientPhoneNumber',
    QUANTITY: 'quantity',
    PRICE: 'price',
    COMMENT: 'comment',
    IS_FINAL: 'isFinal',
}

type TextFieldType = 'text';
type NumberFieldType = 'number';
type CheckBoxFieldType = 'checkBox';
type DateFieldType = 'startDate' | 'endDate';
export const FIELD_TYPE: { CHECK_BOX: CheckBoxFieldType, TEXT: TextFieldType, NUMBER: NumberFieldType, START_DATE: DateFieldType, END_DATE: DateFieldType } = {
    TEXT: 'text',
    NUMBER: 'number',
    START_DATE: 'startDate',
    END_DATE: 'endDate',
    CHECK_BOX: 'checkBox',
};

interface AccommodationConfigField<T> {
    name: string;
    label: string;
    type: string;
    default: T;
    isRequired?: boolean;
    min?: T;
    max?: T;
}

export interface AccommodationConfigNumberField extends AccommodationConfigField<number> {
    type: 'number'
}

export interface AccommodationConfigTextField extends AccommodationConfigField<string> {
    type: 'text'
}

export interface AccommodationConfigCheckBoxField extends AccommodationConfigField<boolean> {
    type: 'checkBox'
}

export interface AccommodationConfigDateField extends AccommodationConfigField<Date> {
    type: 'startDate' | 'endDate'
}

export type AccommodationConfigInputField =
    AccommodationConfigNumberField
    | AccommodationConfigCheckBoxField
    | AccommodationConfigTextField
    | AccommodationConfigDateField;

export interface AccommodationConfigActionGroup {
    position: 'left' | 'right' | 'center';
    CANCEL?: { label: string; action: () => void, color: 'default' | 'primary' | 'secondary' };
    CONFIRM?: { label: string; color: 'default' | 'primary' | 'secondary' };
    DELETE?: { label: string; action: () => void, color: 'default' | 'primary' | 'secondary' };
}

export interface AccommodationConfig {
    getTitle: (roomName: string | number) => string,
    onSubmit: (accommodation: Partial<AccommodationInfo>) => void
    details: { startDateName: string, endDateName: string, priceName: string };
    fields: AccommodationConfigInputField[][];
    actions: AccommodationConfigActionGroup[];
}

const CREATE_ACCOMMODATION_PROPS: (request: CREATE_REQUEST) => AccommodationConfig =
    (request) => ({
        getTitle: roomName => `Создать заселение в комнате ${roomName}`,
        details: {startDateName: FIELD.START_DATE, endDateName: FIELD.END_DATE, priceName: FIELD.PRICE},
        fields: [
            [
                {
                    name: FIELD.START_DATE,
                    type: FIELD_TYPE.START_DATE,
                    label: 'Начиная с',
                    default: request.defaultProps.startDate
                },
                {name: FIELD.END_DATE, type: FIELD_TYPE.END_DATE, label: 'До', default: request.defaultProps.endDate}],
            [
                {name: FIELD.NAME, type: FIELD_TYPE.TEXT, label: 'Имя Клиента', default: ''},
                {
                    name: FIELD.PHONE_NUMBER,
                    type: FIELD_TYPE.TEXT,
                    label: 'Номер Телефона',
                    default: '',
                    isRequired: true
                }],
            [
                {
                    name: FIELD.QUANTITY,
                    type: FIELD_TYPE.NUMBER,
                    label: 'Кол-во людей',
                    min: 1,
                    default: 2,
                    isRequired: true
                },
                {
                    name: FIELD.PRICE,
                    type: FIELD_TYPE.NUMBER,
                    label: 'Цена (номер/сутки)',
                    min: 1,
                    default: 100,
                    isRequired: true
                }],
            [{name: FIELD.COMMENT, type: FIELD_TYPE.TEXT, label: 'Комментарий', default: ''}],
            [{name: FIELD.IS_FINAL, type: FIELD_TYPE.CHECK_BOX, label: 'Выезд точно в указанный день', default: true}],
        ],
        actions: [
            {
                position: 'right',
                CANCEL: {label: 'Отмена', action: request.CANCEL, color: 'default'},
                CONFIRM: {label: 'Создать', color: 'primary'},
            }
        ],
        onSubmit: request.CONFIRM,
    });

const UPDATE_ACCOMMODATION_PROPS: (request: UPDATE_REQUEST) => AccommodationConfig = (request) => ({
    getTitle: roomName => `Изменить заселение в комнате ${roomName}`,
    details: {startDateName: FIELD.START_DATE, endDateName: FIELD.END_DATE, priceName: FIELD.PRICE},
    fields: [
        [
            {
                name: FIELD.START_DATE,
                type: FIELD_TYPE.START_DATE,
                label: 'Начиная с',
                default: request.accommodation.startDate
            },
            {name: FIELD.END_DATE, type: FIELD_TYPE.END_DATE, label: 'До', default: request.accommodation.endDate}
        ],
        [
            {name: FIELD.NAME, type: FIELD_TYPE.TEXT, label: 'Имя Клиента', default: request.accommodation.client.name},
            {
                name: FIELD.PHONE_NUMBER,
                type: FIELD_TYPE.TEXT,
                label: 'Номер Телефона',
                default: request.accommodation.client.phoneNumber,
                isRequired: true,
            }
        ],
        [
            {
                name: FIELD.QUANTITY,
                type: FIELD_TYPE.NUMBER,
                label: 'Кол-во людей',
                min: 1,
                default: request.accommodation.quantity,
                isRequired: true
            },
            {
                name: FIELD.PRICE,
                type: FIELD_TYPE.NUMBER,
                label: 'Цена (номер/сутки)',
                min: 1,
                default: request.accommodation.price,
                isRequired: true
            }],
        [{name: FIELD.COMMENT, type: FIELD_TYPE.TEXT, label: 'Комментарий', default: request.accommodation.comment}],
        [{
            name: FIELD.IS_FINAL,
            type: FIELD_TYPE.CHECK_BOX,
            label: 'Выезд точно в указанный день',
            default: request.accommodation.isFinal
        }],
    ],
    actions: [
        {
            position: 'left',
            DELETE: {label: 'Удалить', action: request.DELETE, color: 'secondary'}
        },
        {
            position: 'right',
            CANCEL: {label: 'Отмена', action: request.CANCEL, color: 'default'},
            CONFIRM: {label: 'Обновить', action: request.CONFIRM, color: 'primary'},
        }
    ],
    onSubmit: request.CONFIRM,
})

export interface CREATE_REQUEST {
    type: 'create';
    CONFIRM: (accommodationData: Partial<RawAccommodationInfo>) => void;
    CANCEL: () => void;
    defaultProps: { startDate: Date, endDate: Date }
}

export interface UPDATE_REQUEST {
    type: 'update';
    CONFIRM: (accommodationData: Partial<RawAccommodationInfo>) => void;
    CANCEL: () => void;
    DELETE: () => void;
    accommodation: AccommodationInfo;
}

export const getConfig = (actions: CREATE_REQUEST | UPDATE_REQUEST) => {
    if (actions.type === 'create') {
        return CREATE_ACCOMMODATION_PROPS(actions);
    }
    return UPDATE_ACCOMMODATION_PROPS(actions);
}
