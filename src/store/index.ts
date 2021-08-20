import { configureStore, EnhancedStore } from '@reduxjs/toolkit'

import { LanguageStore, languageStore } from './languageStore';
import { roomStore, RoomStoreType } from './roomStore';
import { roomsAccommodationsHistoryStore, RoomsAccommodationsStoreType } from './roomsAccommodationsStore';

export interface IStore {
	languageStore: LanguageStore,
	roomStore: RoomStoreType,
	roomsAccommodationsHistory: RoomsAccommodationsStoreType,
}

export const store: EnhancedStore<IStore> = configureStore({
	reducer: {
		languageStore: languageStore.reducer,
		roomStore: roomStore.reducer,
		roomsAccommodationsHistory: roomsAccommodationsHistoryStore.reducer,
	},
});
