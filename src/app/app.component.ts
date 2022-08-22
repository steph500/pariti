import { Component } from '@angular/core';
import { ShopItemsInitialData } from './app.response.request';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'pariti';
  number: number = 0;
  isThereChangeAvailable: boolean = false;
  shopItems: ShopItemsInitialData[] = [];
  selectedItems: ShopItemsInitialData[] = [];
  currency: string = 'USD';
  dollarDenominations = [1, 2, 5, 10, 20, 50, 100];
  amountInMachine: { [key: number]: number } = {};
  totalAmountInMachine = 0;

  totalAmountForSelectedItems = 0;

  change: { [key: number]: number } = {};
  totalChange = 0;

  totalAmountInserted = 0;
  amountInserted: { [key: number]: number } = {};

  constructor(private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get<ShopItemsInitialData[]>('api/shopItems').subscribe((data: ShopItemsInitialData[]) => {
      this.shopItems = data;
      console.log(this.shopItems);
    });

    this.http.get<{ [key: number]: number }>('api/amountInMachine').subscribe((data: { [key: number]: number }) => {
      this.amountInMachine = data;
      this.totalAmountInMachine = this.amountInMachine[1] * 1 + this.amountInMachine[2] * 2 + this.amountInMachine[5] * 5 +
        this.amountInMachine[10] * 10 + this.amountInMachine[20] * 20 + this.amountInMachine[50] * 50 + this.amountInMachine[100] * 100;
      console.log(this.amountInMachine);
    });
  }

  // function to generate random values for amountInserted
  generateRandomValues() {
    for (let i = 0; i < this.dollarDenominations.length; i++) {
      this.amountInserted[this.dollarDenominations[i]] = Math.floor(Math.random() * 10) + 1;
      this.totalAmountInserted += this.amountInserted[this.dollarDenominations[i]] * this.dollarDenominations[i];
    }

    if (this.totalAmountInserted > this.totalAmountInMachine) {
      alert('Not enough money in machine or change, Generate new values');
      this.totalAmountInserted = 0;
      this.amountInserted = {};
    }
    console.log(this.amountInserted);
  }

  // function to add selected items to selectedItems array
  addSelectedItem(item: ShopItemsInitialData) {

    this.totalAmountForSelectedItems = item.price + this.totalAmountForSelectedItems;

    if (this.totalAmountInserted > this.totalAmountForSelectedItems && item.quantity > 0) {
      this.selectedItems.push(item);
      item.quantity--;
    }
    else if (item.quantity <= 0) {
      this.totalAmountForSelectedItems = this.totalAmountForSelectedItems - item.price;
      alert('No more ' + item.name + ' available');
    }
    else {
      this.totalAmountForSelectedItems = this.totalAmountForSelectedItems - item.price;
      alert('Not enough money to purchase items');
    }
  }

  checkChange() {
    this.totalChange = this.totalAmountInMachine - this.totalAmountForSelectedItems;
    console.log(this.amountInMachine);
    console.log(this.totalChange);
    console.log(this.totalAmountInMachine);
    console.log(this.totalAmountForSelectedItems);

    for (let i = this.dollarDenominations.length; i > 0; i--) {
      if (this.totalChange >= this.amountInMachine[this.dollarDenominations[i - 1]]) {

        var denomination = Math.floor(this.totalChange / this.dollarDenominations[i - 1]);

        if (denomination <= this.amountInMachine[this.dollarDenominations[i - 1]]) {
          this.change[this.dollarDenominations[i - 1]] = denomination;

          this.totalChange = this.totalChange - denomination * this.dollarDenominations[i - 1];
          this.amountInMachine[this.dollarDenominations[i - 1]] =
            this.amountInMachine[this.dollarDenominations[i - 1]] - denomination;

        } else {

          this.change[this.dollarDenominations[i - 1]] = this.amountInMachine[this.dollarDenominations[i - 1]];

          this.totalChange = this.totalChange - this.amountInMachine[this.dollarDenominations[i - 1]] * this.dollarDenominations[i - 1];

          this.amountInMachine[this.dollarDenominations[i - 1]] = 0;
        }

      }
    }

    if (this.totalChange) {
      return false;
    }
    console.log(this.totalChange)
    console.log(this.amountInMachine);
    console.log(this.change);
    return true;
  }

  // function to allow user to buy an item
  buyItems() {

    this.isThereChangeAvailable = this.checkChange();
    if (this.isThereChangeAvailable) {

      for (let x = 0; x < this.selectedItems.length; x++) {
        let url = 'api/shopItems/' + this.selectedItems[x].id;
        this.http.post(url, this.shopItems[this.selectedItems[x].id - 1]).subscribe(data => {
        });
      }
    } else {
      alert("ERROR: - Money in machine not enough for change, Please contact admin for assistance")
    }

  }

  // fuction to update price of an item
  updatePrice(item: ShopItemsInitialData, newPrice: number) {
    item.price = newPrice;
    let url = 'api/shopItems/' + item.id + 1;
    this.http.post(url, item).subscribe(data => {
      alert('Price updated');
    });
  }

  // function to update quantity of an item
  updateQuantity(item: ShopItemsInitialData, newQuantity: number) {
    item.quantity = newQuantity;
    let url = 'api/shopItems/' + item.id + 1;
    this.http.post(url, item).subscribe(data => {
      alert('Quantity updated');
    });
  }

  // function to update cash for amountInMachine
  updateCash(denomination: number, newQuantity: number) {
    this.amountInMachine[denomination] = newQuantity + this.amountInMachine[denomination];
    let url = 'api/amountInMachine/' + denomination;
    this.http.post(url, this.amountInMachine[denomination]).subscribe(data => {
      alert('Cash updated');
    });
  }

  // function to add new item to shopItems array
  addItem(item: ShopItemsInitialData) {
    this.shopItems.push(item);
    let url = 'api/shopItems';
    this.http.post(url, item).subscribe(data => {
      alert('Item added');
    });
  }
}
