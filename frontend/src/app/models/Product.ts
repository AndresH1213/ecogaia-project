import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl

export class Product {
    constructor(
        public _id: string,
        public name: string,
        public price: number,
        public imageUrl: string[],
        public characteristics?: any,
        public code?: string
    ) { this.characteristics = characteristics || {} }

    get getCharacteristics() {
        return this.characteristics
    }

    get allImages() {
        let imagesArray = []
        for (let i = 0; i < this.imageUrl.length; i++ ) {
            //upload/products/no-image
            if (!this.imageUrl[i]) {
                imagesArray.push(`${baseUrl}/products/image/product/no-image`)
            } else if (this.imageUrl[i].includes('http')) {
                imagesArray.push(this.imageUrl[i])
            } else {
                imagesArray.push(`${baseUrl}/products/image/product/${this.imageUrl[i]}`)
            }
        }
        return imagesArray
    }

    get oneImage() {
        if (!this.imageUrl[0]) {
            return `${baseUrl}/products/image/product/no-image`
        } else if (this.imageUrl[0].includes('http')) {
            return this.imageUrl[0]
        } else {
            return `${baseUrl}/products/image/product/${this.imageUrl[0]}`
        }
    }
}
