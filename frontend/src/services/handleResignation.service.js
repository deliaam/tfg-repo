import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/handleResignation/`;
class HandleResignationService {
    create(userId, taskId) {
        return axios.post(API_URL + 'create', { userId, taskId }, { headers: authHeader() }).then((response) => {
            return response.data;
        });
    }
}

export default new HandleResignationService();
