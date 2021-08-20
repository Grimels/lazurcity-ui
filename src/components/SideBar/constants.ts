import { Language } from '../../types/language';
import { RU } from '../../constants/language';

export const SEASON: Map<Language, string> = new Map([
	[RU, `Сезон ${new Date().getFullYear()}`]
]);
