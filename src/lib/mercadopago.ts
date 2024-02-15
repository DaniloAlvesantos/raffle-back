import { MercadoPagoConfig } from "mercadopago";
import { config } from "../config/config";

const MercadoPagoClient = new MercadoPagoConfig({ accessToken: config.access_token });

export { MercadoPagoClient }