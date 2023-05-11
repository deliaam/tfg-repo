import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/correction/`;
class CorrectionService {
    createCorrection(userId, solutionId, description, qualification, files) {
        let formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('userId', userId);
        formData.append('solutionId', solutionId);
        formData.append('description', description);
        formData.append('qualification', qualification);

        return axios.post(API_URL + 'create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    getCorrections(solutionId) {
        return axios
            .get(API_URL + 'getCorrections', {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
                params: { solutionId: solutionId }
            })
            .then((response) => {
                return response.data;
            });
    }
    deleteCorrection(correctionId) {
        return axios.post(API_URL + 'deleteCorrection', { correctionId }, { headers: authHeader() }).then((response) => {
            return response.data;
        });
    }
}

export default new CorrectionService();
