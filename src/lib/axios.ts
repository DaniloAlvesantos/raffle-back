import axios from "axios";
import { config as configEnv} from "../config/config"

export const api_mercadopago = axios.create({
    baseURL:"https://api.mercadopago.com",
})

api_mercadopago.interceptors.request.use(async (config) => {
    const token = configEnv.access_token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})