export const API = '/api';

export type LoadingStatus = 'loading';
export type SuccessStatus = 'success';
export type ErrorStatus = 'error';
export type Status = LoadingStatus | SuccessStatus | ErrorStatus;

export const STATUS: { LOADING: LoadingStatus, SUCCESS: SuccessStatus, ERROR: ErrorStatus } = {
	LOADING: 'loading',
	SUCCESS: 'success',
	ERROR: 'error',
}