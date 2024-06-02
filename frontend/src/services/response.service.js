import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/response/`;
class ResponseService {
    createResponse(userId, questionId, description, files) {
        let formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('userId', userId);
        formData.append('questionId', questionId);
        formData.append('description', description);

        return axios.post(API_URL + 'create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    getResponses(questionId, userId) {
        return axios
            .get(API_URL + 'getResponses', {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
                params: { questionId: questionId, userId: userId }
            })
            .then((response) => {
                return response.data;
            });
    }
    setCorrect(responseId) {
        return axios.post(API_URL + 'setCorrect', { responseId }, { headers: authHeader() }).then((response) => {
            return response.data;
        });
    }
}

export default new ResponseService();
