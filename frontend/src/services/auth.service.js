import axios from 'axios';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/auth/`;

class AuthService {
    login(username, password) {
        return axios.post(API_URL + 'signin', { username, password }).then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }

            return response.data;
        });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(name, lastName, username, password, role, teacherKey) {
        return axios.post(API_URL + 'signup', {
            username,
            name,
            lastName,
            password,
            role,
            teacherKey
        });
    }
}

export default new AuthService();
