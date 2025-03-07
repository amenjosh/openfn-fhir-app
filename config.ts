import * as dotenv from "dotenv";

dotenv.config();

export const headers = process.env["FHIR_HEADER "] as string;

export const baseURL = process.env.BASE_URL as string;