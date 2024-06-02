import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/question/`;
class QuestionService {
    create(title, description, files, lessonId, taskId, userId) {
        let formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('title', title);
        formData.append('userId', userId);
        formData.append('description', description);
        if (lessonId) formData.append('lessonId', lessonId);
        if (taskId) formData.append('taskId', taskId);

        return axios.post(API_URL + 'create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    getQuestions(classId, taskId) {
        return axios
            .get(API_URL + 'getQuestions', {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
                params: { classId: classId, taskId: taskId }
            })
            .then((response) => {
                return response.data;
            });
    }
}

export default new QuestionService();
