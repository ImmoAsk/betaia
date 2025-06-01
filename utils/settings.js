import { PROTOCOL_ERRORS_SYMBOL } from "@apollo/client/errors";
import "dotenv/config";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const COUNTRY = "tg";
export { API_URL, IMAGE_URL, BASE_URL, COUNTRY, RESEND_API_KEY };
