import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CartService} from "../../services/cart.service";
import {FormService} from "../../services/form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {ValidatorsClass} from "../../validators/validatorsClass";

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
                firstName: new FormControl('',
                    [Validators.required,
                        Validators.minLength(2),
                        ValidatorsClass.notOnlyWhitespace]),

                lastName:  new FormControl('',
                    [Validators.required,
                        Validators.minLength(2),
                        ValidatorsClass.notOnlyWhitespace]),

                email: new FormControl('',
                    [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
            }),
            shippingAddress: this.formBuilder.group({
                street: new FormControl('', [Validators.required, Validators.minLength(2),
                    ValidatorsClass.notOnlyWhitespace]),
                city: new FormControl('', [Validators.required, Validators.minLength(2),
                    ValidatorsClass.notOnlyWhitespace]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                    ValidatorsClass.notOnlyWhitespace])
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl('', [Validators.required, Validators.minLength(2),
                    ValidatorsClass.notOnlyWhitespace]),
                city: new FormControl('', [Validators.required, Validators.minLength(2),
                    ValidatorsClass.notOnlyWhitespace]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                    ValidatorsClass.notOnlyWhitespace])
            }),
            creditCard: this.formBuilder.group({
                cardType: new FormControl('', [Validators.required]),
                nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2),
                    ValidatorsClass.notOnlyWhitespace]),
                cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
                securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
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

    get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
    get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
    get email() { return this.checkoutFormGroup.get('customer.email'); }

    copyShippingAddressToBillingAddress({event}: { event: any }) {
        if (event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
            this.billingAddressStates = this.shippingAddressStates
        } else {
            this.checkoutFormGroup.controls['billingAddress'].reset();
            this.billingAddressStates = []
        }

    }

    onSubmit() {
        console.log("onSubmit \n")
        if(this.checkoutFormGroup.invalid){
            this.checkoutFormGroup.markAllAsTouched();
        }
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
