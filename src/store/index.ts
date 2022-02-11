import { configureStore, EnhancedStore } from '@reduxjs/toolkit'

import { LanguageStore, languageStore } from './languageStore';
import { roomStore, RoomStoreType } from './roomStore';
import { roomsAccommodationsHistoryStore, RoomsAccommodationsStoreType } from './roomsAccommodationsStore';
import { clientStore, ClientStoreType } from './clientStore';

export interface IStore {
	languageStore: LanguageStore,
	roomStore: RoomStoreType,
	clientStore: ClientStoreType,
	roomsAccommodationsHistory: RoomsAccommodationsStoreType,
}

export const store: EnhancedStore<IStore> = configureStore({
	reducer: {
		languageStore: languageStore.reducer,
		roomStore: roomStore.reducer,
		clientStore: clientStore.reducer,
		roomsAccommodationsHistory: roomsAccommodationsHistoryStore.reducer,
	},
});
