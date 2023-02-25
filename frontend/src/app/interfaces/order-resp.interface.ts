export interface OrderResp {
    ok:     boolean;
    orders: Order[];
    hits:   number;
}

export interface Order {
    shippingAddress: ShippingAddress;
    orderNumber:     string;
    _id:             string;
    userId:          string;
    cart:            Cart[];
    totalPrice:      number;
    delivered:       boolean;
    payment:         boolean;
    orderDate:       Date;
    __v:             number;
}

export interface Cart {
    product:  Product | null;
    quantity: number;
    _id:      string;
}

export interface Product {
    _id:  string;
    name: string;
}

export interface ShippingAddress {
    zip_code:         string;
    state:            string;
    city:             string;
    address:          string;
    addressExtraInfo: string;
}


