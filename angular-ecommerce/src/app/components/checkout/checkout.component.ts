import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {CartService} from "../../services/cart.service";
import {Subscription} from "rxjs";
import {FormService} from "../../services/form.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears : number[] = [];
  creditCardMonths : number[] = [];

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private formService: FormService) { }

  ngOnInit(): void {
    this.getReview();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    const startMonth : number = new Date().getMonth() + 1;
    console.log("start month : " + startMonth)
    this.formService.getCreditCardMonths(startMonth).subscribe(value => {
      console.log("Credit card months : " + JSON.stringify(value));
      this.creditCardMonths = value;
    })
    const startYear : number = new Date().getFullYear() + 1;
    console.log("start year : " + startYear)
    this.formService.getCreditCardYear().subscribe(value => {
      console.log("Credit card year : " + JSON.stringify(value));
      this.creditCardYears = value;
    })
  }

  copyShippingAddressToBillingAddress({event}: { event: any }) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
          .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }

  }

  onSubmit() {
  }

  private getReview() {
    this.cartService.totalPrice.subscribe(value => this.totalPrice = value);
    this.cartService.totalQuantity.subscribe(value => this.totalQuantity = value);
  }
}
