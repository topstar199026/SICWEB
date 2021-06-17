import axios from 'src/utils/axios';

export const getFamilies = async () => {
    const response = await axios.get<{}>('/api/item/families', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const getSubFamilies = async () => {
    const response = await axios.get<{}>('/api/item/subfamilies', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const getUnits = async () => {
    const response = await axios.get<{}>('/api/item/units', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const saveFamily = async (family) => {
    const response = await axios.post<{}>('/api/item/savefamilies', {family});
    if(response.status === 200) return response.data;
    else return [];
}

export const saveSubFamily = async (family, subFamily) => {
    const response = await axios.post<{}>('/api/item/savesubfamilies', {family, subFamily});
    if(response.status === 200) return response.data;
    else return [];
}

export const saveUnit = async ({unit}) => {
    const response = await axios.post<{}>('/api/item/saveunit', {unit});
    if(response.status === 200) return response.data;
    else return [];
}
