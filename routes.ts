import { Request, Response, Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { readUserFromDatabase, readAllUsersFromDatabase, updateUserInDatabase, saveUserToDatabase, deleteUserFromDatabase } from "./database/operations.ts";
import { validateNewUser } from "./types/validate.ts";

export const router = new Router();

router.get('/api', ({response}: {response: Response}) => {
    response.body = {
        success: true,
        message: 'Welcome to API!',
        data: [
            {
                endpoint: '/readUsers',
                method: 'get',
                description: 'Load all users data.'
            },
            {
                endpoint: '/readUsers/[userId]',
                method: 'get',
                description: 'Load data for user ID. Example: /readUsers/5'
            },
            {
                endpoint: '/newUser',
                method: 'post',
                description: 'New user save to database.'
            },
            {
                endpoint: '/deleteUser/[userId]',
                method: 'delete',
                description: 'Delete user. Example: /deleteUser/5'
            },
            {
                endpoint: '/updateUser/[userId]',
                method: 'put',
                description: 'Update user. Example: /updateUser/5'
            },
        ]
    }
})
.get('/api/readUsers', async ({response}: {response: Response}) => {
    response.body = {
        success: true,
        message: 'Load all users data.',
        data: await readAllUsersFromDatabase()
    }
})
.get('/api/readUsers/:user', async ({response, params}: {response: Response; params: RouterContext<'/api/readUsers/:user'>['params']}) => {
    const user = typeof params.user === 'string' ? +params.user : 0;
    const userData = user ? await readUserFromDatabase(user) : null;
    response.status = user ? 200 : 400;
    response.body = {
        success: !!userData,
        message: userData ? `Load data for user ID: ${user}` : 'User not found',
        data: userData
    }
})
.post('/api/newUser', async ({request, response}: {request: Request, response: Response}) => {
    const value = await request.body({type: 'json'}).value;
    const user = validateNewUser(value) ? value : null;
    if (user) {
        await saveUserToDatabase(user)
    }
    response.status = user ? 201 : 400;
    response.body = {
        success: !!user,
        message: user ? 'New user was save to database.' : 'Missing data in your request call.',
        data: user
    }
})
.delete('/api/deleteUser/:user', async ({response, params}: {response: Response; params: RouterContext<'/api/deleteUser/:user'>['params']}) => {
    const user = typeof params.user === 'string' ? +params.user : 0;
    if (user) {
        await deleteUserFromDatabase(user)
    }
    response.status = user ? 200 : 400;
    response.body = {
        success: !!user,
        message: user ? `User ID: ${user} was deleted.` : 'Invalid user ID.'
    }
})
.put('/api/updateUser/:user', async ({request, response, params}: {request: Request; response: Response; params: RouterContext<'/api/updateUser/:user'>['params']}) => {
    const userId = typeof params.user === 'string' ? +params.user : 0;
    const value = await request.body({type: 'json'}).value;
    const user = validateNewUser(value) ? value : null;
    const updateUser = user && userId ? {...user, id: userId} : null;
    if (updateUser) {
        await updateUserInDatabase(updateUser);
    }
    response.status = updateUser ? 200 : 400;
    response.body = {
        success: !!updateUser,
        message: updateUser ? `User ID: ${userId} was updated.` : 'Invalid user ID'
    }
});