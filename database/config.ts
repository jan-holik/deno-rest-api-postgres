import { load } from "https://deno.land/std/dotenv/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

/**
 * Socket connection is for UNIX systems ONLY!
 */
export const dbSocketConnection = {
    user: config().USER,
    database: config().DATABASE,
    password: config().PASSWORD,
    server: config().SERVER,
    port: config().PORT
}

const env = await load();
const server = env['SERVER'];
const port = env['PORT'];
const user = env['USER'];
const password = env['PASSWORD'];
const database = env['DATABASE'];

export const dbConfig = {
    database,
    hostname: server,
    password,
    port,
    user
}