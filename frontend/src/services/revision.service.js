import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/revision/`;
class CorrectionService {
    createRevision(userId, correctionId) {
        return axios.post(API_URL + 'create', { correctionId, userId }, { headers: authHeader() }).then((response) => {
            return response.data;
        });
    }
    reviewCorrection(correctionId) {
        return axios.post(API_URL + 'reviewCorrection', { correctionId }, { headers: authHeader() }).then((response) => {
            return response.data;
        });
    }
    getRevisions(classId) {
        return axios
            .get(API_URL + 'getRevisions', {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
                params: { classId: classId }
            })
            .then((response) => {
                return response.data;
            });
    }
}

export default new CorrectionService();
