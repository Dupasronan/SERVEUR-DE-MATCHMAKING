export class User {
    id: number;
    username: string;
    email: string;
    createdAt: Date;

    constructor(id: number, username: string, email: string, createdAt?: Date) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = createdAt || new Date();
    }
}
