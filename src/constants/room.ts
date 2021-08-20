export const ROOMS_REDUCER = 'rooms';
export const ACCOMMODATION_DAY_STATE_START = 'START';
export const ACCOMMODATION_DAY_STATE_FINISH_START = 'FINISH&START';

export const ACCOMMODATION_DAY_STATE = {
	START: ACCOMMODATION_DAY_STATE_START,
	IN_PROGRESS: 'Accommodation in progress today',
	FINISH: 'Accommodation finishes today',
	EMPTY: 'Accommodation is not present today',
	FINISH_START: ACCOMMODATION_DAY_STATE_FINISH_START,
}

