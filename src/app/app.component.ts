import { Component } from '@angular/core';
import { ShopItemsInitialData } from './app.response.request';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pariti';

  constructor() { 
    // standing data for the shop items
    this.items.push(new ShopItemsInitialData('Item 1', 10, 10));
    this.items.push(new ShopItemsInitialData('Item 2', 20, 10));
    this.items.push(new ShopItemsInitialData('Item 3', 30, 10));
    this.items.push(new ShopItemsInitialData('Item 4', 40, 10));
    this.items.push(new ShopItemsInitialData('Item 5', 50, 10));
    this.items.push(new ShopItemsInitialData('Item 6', 60, 10));
    this.items.push(new ShopItemsInitialData('Item 7', 70, 10));
    this.items.push(new ShopItemsInitialData('Item 8', 80, 10));
  }

  items: ShopItemsInitialData[] = [];

  // standing data for items in a vending maching

  selectedItems: ShopItemsInitialData[] = [];
  currency: string = 'USD';

  // dollar denominations for the vending machine
  dollarDenominations = [1, 2, 5, 10, 20, 50, 100];

  // amount of money in the vending machine for each denomination
  amount = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 };

  // total amount of money available in the vending machine
  totalAmount = this.amount[1] * 1 + this.amount[2] * 2 + this.amount[5] * 5 +
    this.amount[10] * 10 + this.amount[20] * 20 + this.amount[50] * 50 + this.amount[100] * 100;

  amountInserted = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 };
  totalAmountInserted = this.amountInserted[1] * 1 + this.amountInserted[2] * 2 +
    this.amountInserted[5] * 5 + this.amountInserted[10] * 10 + this.amountInserted[20] * 20
    + this.amountInserted[50] * 50 + this.amountInserted[100] * 100;

  change = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 };
  totalChange = this.change[1] * 1 + this.change[2] * 2 + this.change[5] * 5 +
    this.change[10] * 10 + this.change[20] * 20 + this.change[50] * 50 + this.change[100] * 100;


  // function to add selected items to selectedItems array
  addSelectedItem(item: ShopItemsInitialData) {
    this.selectedItems.push(item);
    
  }

  // function to allow user to buy an item
  buyItems() {
    // 
  }
}
