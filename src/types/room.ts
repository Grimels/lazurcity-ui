import { IAccommodation } from './accommodation';

export interface IRoom {
	id: number;
	name: string;
	description: string;
	type: string;
	isBusy: boolean;
	accommodations: IAccommodation[];
}

export interface IRoomProjection {
	id: number;
	name: string;
	description: string;
	type: string;
	isBusy: boolean;
}

