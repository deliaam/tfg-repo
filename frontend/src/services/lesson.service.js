import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/lesson/`;
class LessonService {
    create(lessonName, classId) {
        return axios
            .post(
                API_URL + 'add',
                { lessonName, classId },
                {
                    headers: authHeader()
                }
            )
            .then((response) => {
                console.log(`lesson obj : ${JSON.stringify(response.data)}`);
                return response.data;
            });
    }

    getClassLessons(classId) {
        return axios.get(API_URL + 'getClassLessons', { headers: authHeader(), params: { classId: classId } }).then((response) => {
            return response.data;
        });
    }
}

export default new LessonService();
