import { useDispatch, useSelector } from 'react-redux';
import { IStore } from '../store';
import { useEffect } from 'react';
import { STATUS } from '../constants/api';
import { ClientStoreType, fetchClients } from '../store/clientStore';

export const useClients: () => ClientStoreType = () => {
	const clientStore: ClientStoreType = useSelector((store: IStore) => store.clientStore);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (clientStore.status === STATUS.LOADING) dispatch(fetchClients());
	}, [dispatch, clientStore.status]);
	
	return clientStore;
};
