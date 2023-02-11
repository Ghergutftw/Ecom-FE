import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CartService} from "../../services/cart.service";
import {FormService} from "../../services/form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    checkoutFormGroup!: FormGroup;
    totalPrice: number = 0.00;
    totalQuantity: number = 0;

    field : string = ''

    countries : Country[] = []

    shippingAddressStates : State [] = []
    billingAddressStates : State [] = []

    creditCardYears: number[] = [];
    creditCardMonths: number[] = [];

    constructor(private formBuilder: FormBuilder,
                private cartService: CartService,
                private formService: FormService) {
    }

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
        const startMonth: number = new Date().getMonth() + 1;
        // console.log("start month : " + startMonth)
        this.formService.getCreditCardMonths(startMonth).subscribe(value => {
            // console.log("Credit card months : " + JSON.stringify(value));
            this.creditCardMonths = value;
        })
        const startYear: number = new Date().getFullYear() + 1;
        // console.log("start year : " + startYear)
        this.formService.getCreditCardMonths(startMonth).subscribe(value => {
            // console.log("Credit card year : " + JSON.stringify(value));
            this.creditCardYears = value;
        })
        this.formService.getCountries().subscribe(value => {
            this.countries = value;
            // console.log(`Countries : ` + JSON.stringify(value))
        })
    }

    copyShippingAddressToBillingAddress({event}: { event: any }) {
        if (event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        } else {
            this.checkoutFormGroup.controls['billingAddress'].reset();
        }

    }

    onSubmit() {
    }

    handleMonthsAndYears() {
        const creditCardFormGroup = this.checkoutFormGroup.controls['creditCard'];
        const currentYear = new Date().getFullYear();
        const selectedYear: number = Number(creditCardFormGroup.value.expirationYear)

        let startMonth: number;

        if (currentYear === selectedYear) {
            startMonth = new Date().getMonth() + 1
        } else {
            startMonth = 1;
        }
        this.formService.getCreditCardMonths(startMonth).subscribe(value => {
            // console.log(value)
            this.creditCardMonths = value
        })

    }

     getReview() {
        this.cartService.totalPrice.subscribe(value => this.totalPrice = value);
        this.cartService.totalQuantity.subscribe(value => this.totalQuantity = value);
    }

    getStates(formGroupName: string) {
        const shippingFillGroup = this.checkoutFormGroup.controls['shippingAddress']
        const billingFillGroup = this.checkoutFormGroup.controls['billingAddress']
        let CountryCode: string = '';
        if(formGroupName === "shippingAddress"){
            CountryCode = shippingFillGroup.value.country.code
        }else {
            CountryCode = billingFillGroup.value.country.code
        }
        this.formService.getStates(CountryCode).subscribe(value => {
            if(formGroupName === 'shippingAddress'){
                this.shippingAddressStates = value
                shippingFillGroup.get('state')?.setValue(value[0])
            }else if (formGroupName === 'billingAddress'){
                this.billingAddressStates = value
                billingFillGroup.get('state')?.setValue(value[0])
            }

        })
    }
}
