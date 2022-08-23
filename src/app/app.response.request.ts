export class ShopItemsInitialData {

    public constructor(
        public id: number,
        public name: string,
        public price: number,
        public quantity: number
    ) 
     { }
}

export class Amounts {

    public constructor(
        public id: number,
        public amount: number,
    ) 
     { }
}
