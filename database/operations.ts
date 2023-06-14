import { Client } from "https://deno.land/x/postgres/mod.ts";
import { dbConfig } from "./config.ts";
import { User, NewUser } from "../types/user.ts";

const client = new Client(dbConfig);

export const saveUserToDatabase = async (user: NewUser) => {
    await client.connect();
    await client.queryObject('INSERT INTO public.users(name, surname, email) VALUES ($1, $2, $3)', [
        user.name,
        user.surname,
        user.email
    ])
    await client.end()
}

export const readUserFromDatabase = async (id: User['id']): Promise<User | undefined> => {
    await client.connect()
    const result = await client.queryObject<User>('SELECT * FROM public.users WHERE id = $1', [id])
    await client.end()
    return result.rows[0]
}

export const readAllUsersFromDatabase = async (): Promise<User[] | undefined> => {
    await client.connect()
    const result = await client.queryObject<User>('SELECT * FROM public.users ORDER BY id ASC')
    await client.end()
    return result.rows
}

export const updateUserInDatabase = async (user: User) => {
    const {id, name, surname, email} = user;
    await client.connect()
    await client.queryObject('UPDATE public.users SET name = $1, surname = $2, email = $3 WHERE id = $4',
        [name, surname, email, id]
    )
    await client.end()
}

export const deleteUserFromDatabase = async (id: User['id']) => {
    await client.connect()
    await client.queryObject('DELETE FROM public.users WHERE id = $1', [id])
    await client.end()
}