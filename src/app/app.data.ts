import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ShopItemsInitialData } from './app.response.request'

export class AppData implements InMemoryDbService {


shopItems: ShopItemsInitialData[] = [
    new ShopItemsInitialData(1,'Cocacola', 10, 10),
    new ShopItemsInitialData(2,'Pepsi', 20, 10),
    new ShopItemsInitialData(3,'7 Up', 30, 10),
    new ShopItemsInitialData(4,'Sprite', 40, 10),
    new ShopItemsInitialData(5,'Water', 50, 10),
    new ShopItemsInitialData(6,'Fanta', 60, 10),
    new ShopItemsInitialData(7,'Club', 70, 10),
    new ShopItemsInitialData(8,'Mint', 80, 10)
];

amountInMachine: { [key: number]: number } = { 1: 10, 2: 10, 5: 10, 10: 10, 20: 10, 50: 10, 100: 10 };


  createDb() {
    const amountInMachine = this.amountInMachine;
    const shopItems = this.shopItems;
    return { shopItems, amountInMachine };
  }
}