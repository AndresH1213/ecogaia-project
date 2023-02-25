import { Product } from '../models/Product';
import { Combo } from '../models/Combo';


export interface Cart {
    products: ProductCart[];
    totalValue: number;
}

export interface ProductCart {
    item: Product | Combo;
    cant: number;
    characteristics?: any;
    combo?: boolean
}