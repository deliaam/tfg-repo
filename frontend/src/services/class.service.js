import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/class/`;
class ClassService {
    getAllClasses(teacherId, isTeacher) {
        if (isTeacher) {
            return axios.get(API_URL + 'getAllTeachers', { headers: authHeader(), params: { teacherId: teacherId } }).then((response) => {
                return response.data;
            });
        } else {
            return axios.get(API_URL + 'getAllStudents', { headers: authHeader(), params: { studentId: teacherId } }).then((response) => {
                return response.data;
            });
        }
    }
    getClass(classId) {
        return axios.get(API_URL + 'getClass', { headers: authHeader(), params: { classId: classId } }).then((response) => {
            return response.data;
        });
    }
    createClass(className, teacherId) {
        return axios.post(API_URL + 'add', { className, teacherId }, { headers: authHeader() }).then((response) => {
            return response.data;
        });
    }

    deleteClass(classId) {
        return axios.post(API_URL + 'delete', { classId }, { headers: authHeader() });
    }

    editClass(id, name) {
        return axios.put(API_URL + 'edit', { id, name }, { headers: authHeader() });
    }

    joinClass(classCode, userId) {
        return axios.put(API_URL + 'join', { classCode, userId }, { headers: authHeader() }).then((response) => {
            return response.data;
        });
    }

    unjoinClass(classId, userId) {
        return axios.put(API_URL + 'unjoin', { classId, userId }, { headers: authHeader() }).then((response) => {
            return response.data;
        });
    }
}

export default new ClassService();
