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
  selectedItemForPrice: string | undefined;
  newPrice: number = 0;
  newQuantity: number = 0;

  totalAmountForSelectedItems = 0;

  change: { [key: number]: number } = {};
  totalChange = 0;

  totalAmountInserted = 0;
  amountInserted: { [key: number]: number } = {};
  updateAmountInMachine: { [key: number]: number } = { 1: 0, 2: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 };

  constructor(private http: HttpClient
  ) { }

  ngOnInit() {
    this.selectedItems = [];
    this.totalAmountForSelectedItems = 0;
    this.totalChange = 0;
    this.totalAmountInserted = 0;
    this.amountInserted = {};
    this.change = {};


    this.http.get<ShopItemsInitialData[]>('api/shopItems').subscribe((data: ShopItemsInitialData[]) => {
      this.shopItems = data;
      console.log(this.shopItems);
    });

    this.http.get<{ [key: number]: number }>('api/amountInMachine').subscribe((data: { [key: number]: number }) => {
      console.log(data)
      this.amountInMachine = data;
      this.totalAmountInMachine = this.amountInMachine[1] * 1 + this.amountInMachine[2] * 2 + this.amountInMachine[5] * 5 +
        this.amountInMachine[10] * 10 + this.amountInMachine[20] * 20 + this.amountInMachine[50] * 50 + this.amountInMachine[100] * 100;
    });
  }

  // function to generate random values for amountInserted
  generateRandomValues() {
    for (let i = 0; i < this.dollarDenominations.length; i++) {
      this.amountInserted[this.dollarDenominations[i]] = Math.floor(Math.random() * 10) + 1;
      this.totalAmountInserted += this.amountInserted[this.dollarDenominations[i]] * this.dollarDenominations[i];
    }

    if (this.totalAmountInserted > this.totalAmountInMachine) {
      alert('Not enough money in machine for change, Generate new values');
      this.totalAmountInserted = 0;
      this.amountInserted = {};
      this.ngOnInit();
    }
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
    this.totalChange = this.totalAmountInserted - this.totalAmountForSelectedItems;

    for (let i = this.dollarDenominations.length; i > 0; i--) {

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

    if (this.totalChange) {
      return false;
    }

    this.totalAmountInMachine = this.amountInMachine[1] * 1 + this.amountInMachine[2] * 2 + this.amountInMachine[5] * 5 +
      this.amountInMachine[10] * 10 + this.amountInMachine[20] * 20 + this.amountInMachine[50] * 50 + this.amountInMachine[100] * 100;

    return true;
  }

  // function to allow user to buy an item
  buyItems() {

    this.isThereChangeAvailable = this.checkChange();

    if (this.isThereChangeAvailable && this.selectedItems.length > 0) {
      for (let x = 0; x < this.selectedItems.length; x++) {
        let url = 'api/shopItems/' + this.selectedItems[x].id;
        this.http.post(url, this.shopItems[this.selectedItems[x].id - 1]).subscribe(data => {
          if (this.selectedItems.length == x + 1) {
            this.ngOnInit();
            alert('Items bought');
          }
        });
      }

    } else if (this.selectedItems.length <= 0) {
      alert('No items selected');
      this.ngOnInit();
    }
    else {
      alert("ERROR: - Money in machine not enough for change, Please contact admin for assistance")
      this.ngOnInit();
    }

  }

  // fuction to update price of an item
  updatePrice() {
    // find selected item in shopItems array
    for (let i = 0; i < this.shopItems.length; i++) {
      if (this.shopItems[i].name == this.selectedItemForPrice) {
        this.shopItems[i].price = this.newPrice;

        let url = 'api/shopItems/' + this.shopItems[i].id;
        this.http.post(url, this.shopItems[i]).subscribe(data => {
          alert('Price updated');
          this.ngOnInit();
        });
      }
    }
  }

  // function to update quantity of an item
  updateQuantity() {
    for (let i = 0; i < this.shopItems.length; i++) {
      if (this.shopItems[i].name == this.selectedItemForPrice) {
        this.shopItems[i].quantity = this.shopItems[i].quantity + this.newQuantity;

        let url = 'api/shopItems/' + this.shopItems[i].id;
        this.http.post(url, this.shopItems[i]).subscribe(data => {
          alert('Quantity updated');
          this.ngOnInit();
        });
      }
    }
  }

  // function to update cash for amountInMachine
  updateCash() {
    // update updateAmountInserted to amountInserted array
    // for (let i = 0; i < this.dollarDenominations.length; i++) {
    //   this.amountInMachine[this.dollarDenominations[i]] = this.updateAmountInMachine[this.dollarDenominations[i]] +
    //     this.amountInMachine[this.dollarDenominations[i]];

    //   console.log(this.amountInMachine[this.dollarDenominations[i]]);

    //   let url = 'api/amountInMachine/' + this.dollarDenominations[i];

    //    this.http.post<{ [key: number]: number }>(url, this.amountInMachine[i]).subscribe(data => {

    //     alert('Quantity updated');
    //     this.ngOnInit();
    //   });

    // }

    // this.http.get('api/amountInMachine').subscribe((data) => {
    //   console.log(data)

    // });

    this.http.post('api/amountInMachine', this.amountInMachine).subscribe((data) => {
      console.log(data)
    });


  }
}
