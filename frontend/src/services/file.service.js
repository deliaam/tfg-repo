import axios from 'axios';
import authHeader from './auth-header';
import { apiUrl } from './constant';
const API_URL = `${apiUrl}/file/`;
class FileService {
    upload(files) {
        let formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });
        return axios.post(API_URL + 'upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    getFile(id) {
        return axios.get(API_URL + 'getFile', { params: { id: id }, responseType: 'blob' }).then((response) => {
            const contentDisposition = response.headers['content-disposition'];
            const filenameMatch = contentDisposition.match(/"(.+)"/);

            return { data: response.data, fileName: filenameMatch };
        });
    }
}

export default new FileService();
