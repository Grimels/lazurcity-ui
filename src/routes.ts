import { Language } from './types/language';
import { RU } from './constants/language';

import { Today, Dashboard, SvgIconComponent } from '@material-ui/icons';

export interface Route {
    path: string,
    label: Map<Language, string>,
    Icon: SvgIconComponent,
}

export const ROUTES: Route[] = [
    { Icon: Today, label: new Map([[RU, 'Календарь']]), path: '/calendar' },
    { Icon: Dashboard, label: new Map([[RU, 'Статистика']]), path: '/dashboard' },
]