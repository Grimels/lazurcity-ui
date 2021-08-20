import { Language } from '../../types/language';
import { RU } from '../../constants/language';

export interface RoomTableColumnTitle {
	name: string;
	type: string;
	freeFrom: string;
}

export const TABLE_COLUMNS: Map<Language, RoomTableColumnTitle> = new Map([
	[RU, { type: 'Тип Комнаты', name: 'Номер Комнаты', freeFrom: 'Свободна с' }]
]);
