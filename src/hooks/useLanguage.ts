import { useSelector } from 'react-redux';

import { IStore } from '../store';

export const useLanguage = () => {
	const language = useSelector((state: IStore) => state.languageStore.language);
	return { language };
};
