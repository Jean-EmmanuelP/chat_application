import { Redis } from "@upstash/redis";

export const db = new Redis({
    url: "https://eu1-expert-fawn-38930.upstash.io",
    token: "AZgSASQgNjUxODg4NzQtNmQ4ZC00NmRhLThkYjMtYmMyN2ZmNGJiOGE5YWEyMjg4NDE5N2U5NDc5MmFkYjFiODUzZGFhODUzNjY=",
});
