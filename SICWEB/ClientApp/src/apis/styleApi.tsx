import axios from 'src/utils/axios';

export const getBrands = async () => {
    const response = await axios.get<{}>('/api/style/allBrands', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const getColor = async (value) => {
    const response = await axios.post<{}>('/api/style/getColor', value);
    if(response.status === 200) return response.data;
    else return [];
}

export const getCategory = async (value) => {
    const response = await axios.post<{}>('/api/style/getCategory', value);
    if(response.status === 200) return response.data;
    else return [];
}

export const getColors = async () => {
    const response = await axios.get<{}>('/api/style/allColors', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const getCategories = async () => {
    const response = await axios.get<{}>('/api/style/allCategories', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const getTallas = async () => {
    const response = await axios.get<{}>('/api/style/allTallas', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const saveStyle = async (value) => {
    const formData = new FormData();
    formData.append('image', value.image);
    const _res = await axios.post<{}>('/api/style/imageUpload', formData);

    const response = await axios.post<{}>('/api/style/saveStyle', value);
    if(response.status === 200) return response.data;
    else return [];
}

export const getStyle = async (value) => {
    const response = await axios.post<{}>('/api/style/getStyle', value);
    if(response.status === 200) return response.data;
    else return [];
}

export const deleteStyle = async (id) => {
    const response = await axios.post<{}>('/api/style/deleteStyle', {id: id});
    if(response.status === 200) return response.data;
    else return [];
}

