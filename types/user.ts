export type User = {
    id: number;
    name: string;
    surname: string;
    email: string;
}

export type NewUser = Omit<User, 'id'>