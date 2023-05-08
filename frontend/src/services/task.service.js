import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/task/`;
class TaskService {
    create(title, description, files, dateTime, lessonId) {
        console.log('upload');
        console.log(files);
        let formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('title', title);
        formData.append('description', description);
        formData.append('dateTime', dateTime);
        formData.append('lessonId', lessonId);

        return axios.post(API_URL + 'create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    getTasks(classId, userId) {
        return axios
            .get(API_URL + 'getTasks', {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
                params: { classId: classId, userId: userId }
            })
            .then((response) => {
                return response.data;
            });
    }
}

export default new TaskService();
