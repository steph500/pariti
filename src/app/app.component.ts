import { Component } from '@angular/core';
import { ShopItemsInitialData } from './app.response.request';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'pariti';
  number: number = 0;

  constructor(
  ) { 
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

  // amountInMachine of money in the vending machine for each denomination with type defination
  amountInMachine: { [key: number]: number } = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 };

  // amountInMachine: { [key: number]: number } = {};
  // total amountInMachine of money available in the vending machine
  totalAmount = this.amountInMachine[1] * 1 + this.amountInMachine[2] * 2 + this.amountInMachine[5] * 5 +
    this.amountInMachine[10] * 10 + this.amountInMachine[20] * 20 + this.amountInMachine[50] * 50 + this.amountInMachine[100] * 100;

  amountInserted: { [key: number]: number } = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 };
  totalAmountInserted = this.amountInserted[1] * 1 + this.amountInserted[2] * 2 +
    this.amountInserted[5] * 5 + this.amountInserted[10] * 10 + this.amountInserted[20] * 20
    + this.amountInserted[50] * 50 + this.amountInserted[100] * 100;

  change: { [key: number]: number } = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 };
  totalChange = this.change[1] * 1 + this.change[2] * 2 + this.change[5] * 5 +
    this.change[10] * 10 + this.change[20] * 20 + this.change[50] * 50 + this.change[100] * 100;


  // function to add selected items to selectedItems array
  addSelectedItem(item: ShopItemsInitialData) {

    // check that the amountInMachine of money inserted is enough to buy the item
    this.totalAmount = item.price + this.totalAmount;

    // update qantity of item in the vending machine
    if(item.quantity) {
      if (this.totalAmountInserted >= this.totalAmount) {
        this.selectedItems.push(item);
        item.quantity--;
      } else {
        alert('Not enough money to purchase more items');
      }
    } else {
      alert('No more items available');
    }
  }

  // function to insert random amountInMachine of money into the vending machine
  insertMoney() {
    this.amountInMachine[1] = Math.floor(Math.random() * 10);
    this.amountInMachine[2] = Math.floor(Math.random() * 10);
    this.amountInMachine[5] = Math.floor(Math.random() * 10);
    this.amountInMachine[10] = Math.floor(Math.random() * 10);
    this.amountInMachine[20] = Math.floor(Math.random() * 10);
    this.amountInMachine[50] = Math.floor(Math.random() * 10);
    this.amountInMachine[100] = Math.floor(Math.random() * 10);
    this.totalAmountInserted = this.amountInMachine[1] * 1 + this.amountInMachine[2] * 2 + this.amountInMachine[5] * 5 +
      this.amountInMachine[10] * 10 + this.amountInMachine[20] * 20 + this.amountInMachine[50] * 50 + this.amountInMachine[100] * 100;
  }

  // function to allow user to buy an item
  buyItems() {
    this.totalChange = this.totalAmountInserted - this.totalAmount;

    // this.totalChange = 1564;
    console.log(this.totalChange)
    // console.log(this.totalAmountInserted)
    console.log(this.amountInMachine);

      for (let i = this.dollarDenominations.length; i > 0; i--) {
        if (this.amountInMachine[this.dollarDenominations[i - 1]] > 0 && this.totalChange >= 
          this.amountInMachine[this.dollarDenominations[i - 1]]) {
          var denomination =  Math.floor(this.totalChange / this.dollarDenominations[i - 1]);
          if (denomination <= this.amountInMachine[this.dollarDenominations[i - 1]]) {
            this.change[this.dollarDenominations[i - 1]] = denomination;

            this.totalChange = this.totalChange - denomination * this.dollarDenominations[i - 1];
            this.amountInMachine[this.dollarDenominations[i - 1]] =
             this.amountInMachine[this.dollarDenominations[i - 1]] - denomination;
          } else {
            this.change[this.dollarDenominations[i - 1]] = this.amountInMachine[this.dollarDenominations[i - 1]];

            var difference = denomination - this.amountInMachine[this.dollarDenominations[i - 1]];

            this.totalChange = this.totalChange - this.amountInMachine[this.dollarDenominations[i - 1]] *
             this.dollarDenominations[i - 1] + difference * this.dollarDenominations[i - 1];


            this.amountInMachine[this.dollarDenominations[i - 1]] = 0;
          }

        } else {
          console.log(this.change);
          alert('Not enough money in machine for change');
        }
      }
      console.log(this.change);
    // reset vending machine

  }
}
