import { Cart } from '../interfaces/product.interface';


export class User {
    constructor(
        public email: string,
        public role: 'CLIENT' | 'ADMINISTRATOR',
        public uid?: string,
        public cart?: Cart,
        public phoneNumber?: number,
        public address?: string,
    ) { }
};

