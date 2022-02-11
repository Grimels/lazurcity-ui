import { API } from '../constants/api';
import { ResponseParser } from '../utils/parseResponseModel';
import { IClient } from '../types/client';

const getClients: () => Promise<IClient[]> = () => fetch(`${API}/clients`)
	.then(response => response.json())
	.then(clients => (clients as IClient[]).map(client => ResponseParser.parseClient(client)));

export const ClientDataService = {
	getClients,
};
