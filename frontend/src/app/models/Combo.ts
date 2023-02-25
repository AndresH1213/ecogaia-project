import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl

export class Combo {
    constructor(
        public _id: string,
        public name: string,
        public price: number,
        public image: string,
        public products: {_id: string, name: string} [],
        public code?: string
    ) { }

    get oneImage() {
        
        return `${baseUrl}/products/image/combo/${this.image}`
        
    }
}