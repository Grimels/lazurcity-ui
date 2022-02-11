import { Language } from './types/language';
import { RU } from './constants/language';

import { Today, Dashboard, SvgIconComponent, SingleBed } from '@material-ui/icons';

export interface Route {
    path: string,
    label: Map<Language, string>,
    Icon: SvgIconComponent,
}

export const ROUTES: Route[] = [
    { Icon: Today, label: new Map([[RU, 'Календарь']]), path: '/calendar' },
    { Icon: Dashboard, label: new Map([[RU, 'Статистика']]), path: '/dashboard' },
    { Icon: SingleBed, label: new Map([[RU, 'Свободные Комнаты']]), path: '/rooms/free' },
    { Icon: SingleBed, label: new Map([[RU, 'Занятые Комнаты']]), path: '/rooms/busy' },
]
