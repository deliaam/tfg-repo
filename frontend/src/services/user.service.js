import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/`;
class UserService {
    getStudent(userId, isTeacher) {
        const api_path = isTeacher ? 'teacher/' : 'student/';
        return axios.get(API_URL + api_path + 'get', { headers: authHeader(), params: { userId: userId } }).then((response) => {
            return response.data;
        });
    }
}

export default new UserService();
