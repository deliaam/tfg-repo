import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/solution/`;
class CorrectionService {
    createCorrection(userId, taskId, description, files) {
        let formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('userId', userId);
        formData.append('taskId', taskId);
        formData.append('description', description);

        return axios.post(API_URL + 'create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    getCorrections(taskId) {
        return axios
            .get(API_URL + 'getSolutions', {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
                params: { taskId: taskId }
            })
            .then((response) => {
                return response.data;
            });
    }
}

export default new CorrectionService();
