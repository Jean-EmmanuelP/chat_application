import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';

dotenv.config();

export const db = new Redis({
    url: process.env.URL as string,
    token: process.env.TOKEN as string,
});
