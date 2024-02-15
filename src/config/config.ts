import {config as dotenvConfig} from "dotenv"
dotenvConfig()

export const config = {
    access_token: process.env.MERCADO_PAGO_ID,
    access_token_teste: process.env.MERCADO_PAGO_ID_TESTE,
    secret_JWT: process.env.JWT_SECRET
}