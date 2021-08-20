import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LANGUAGE_REDUCER, RU } from '../constants/language';
import { Language } from '../types/language';

export interface LanguageStore {
	language: Language
}

const initialState: LanguageStore = { language: RU };

export const languageStore = createSlice({
	name: LANGUAGE_REDUCER,
	initialState,
	reducers: {
		setLanguage({ language }, { payload: newLanguage }: PayloadAction<Language>) {
			language = newLanguage;
		},
	},
});

