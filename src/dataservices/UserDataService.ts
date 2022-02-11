import { API } from '../constants/api';

const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${API}/users/signin`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: username, password})
            }
        );
        return response.ok;
    } catch {
        return false;
    }
}

export const UserDataService = {
    login,
}
