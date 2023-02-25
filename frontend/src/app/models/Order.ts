import { Product } from "./Product";
import { Cart } from '../interfaces/product.interface';
import { User } from "./User";

export class Order {
    constructor(
        public user: User,
        public products: Cart,
        public date: Date,
        public orderId?: string,
    ) { }
};