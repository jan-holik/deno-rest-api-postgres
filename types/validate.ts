import { User, NewUser } from "./user.ts";

export const validateNewUser = (user: NewUser): user is NewUser => {
    return typeof user?.name === 'string' &&
    typeof user?.surname === 'string' &&
    typeof user?.email === 'string';
}

export const validateUser = (user: User): user is User => {
    return validateNewUser(user) && typeof user?.id === 'number';
}