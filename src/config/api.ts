import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import Config from "react-native-config";

const baseUrl    = Config.API_URL;
const getBaseUrl = () => baseUrl;

const instance: AxiosInstance = axios.create({
    headers: {
        Accept:         'application/json',
        'Content-Type': 'application/json',
        Authorization: `Client-ID ${Config.API_KEY}`
    },
});

instance.interceptors.request.use(request => {
    console.log('request', request);
    return request;
});

instance.interceptors.response.use((response: AxiosResponse) => {
    console.log('response', response);

    return response;
}, (error: AxiosError) => {

    console.log('axios error', error, error && error.response);

    if (!error || !error.response) {
        throw error;
    }

    throw error;
});


interface ErrorCodes {
    '200': string;
    '201': string;
    '404': string;
    '401': string;
}

export interface ApiError {
    code: keyof ErrorCodes;
    message?: string;
}

export interface ApiRequest {
    url: string;
    config: AxiosRequestConfig;
}

export async function makeApiRequest<T>(payload: ApiRequest): Promise<T> {
    try {
        const {url, config} = payload;

        const response = await instance(getBaseUrl() + url,
            config,
        );
        return response.hasOwnProperty('data') ? response.data : undefined;
    } catch (e) {
        // handle Axios error
        console.log('e', e);
        const apiError: ApiError = {
            code: e.code,
        };

        if (e && e.hasOwnProperty('response')) {
            apiError.message = e.response.message || '';
        }
        throw apiError;
    }
}
