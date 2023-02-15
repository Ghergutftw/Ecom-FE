import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject,Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartItems: CartItem[] = [];
    totalPrice: Subject<number> = new BehaviorSubject<number>(0);
    totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

    constructor() {
    }

    addToCart(theCartItem: CartItem) {
        let existingCartItem!: CartItem;
        let exists: boolean = false
        if (this.cartItems.length > 0) {
            for (let tempCartItem of this.cartItems) {
                if (tempCartItem.id == theCartItem.id) {
                    existingCartItem = tempCartItem;
                    exists = true
                    break;
                }
            }
        }
        if (exists) {
            existingCartItem.quantity++;
        } else {
            this.cartItems.push(theCartItem);
        }
        this.computeCartTotals();
    }

    computeCartTotals() {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;

        for (let currentCartItem of this.cartItems) {
            totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
            totalQuantityValue += currentCartItem.quantity;
        }

        this.totalPrice.next(totalPriceValue)
        this.totalQuantity.next(totalQuantityValue)
        this.logCartData(totalPriceValue, totalQuantityValue)
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        for (let tempCartItem of this.cartItems) {
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
        }

    }

    decrementQuantity(tempCartItem: CartItem) {
        tempCartItem.quantity--;
        // console.log(tempCartItem.quantity)
        if (tempCartItem.quantity == 0) {
            this.remove(tempCartItem)
        } else {
            this.computeCartTotals();
        }
    }

    remove(theCartItem: CartItem) {
        const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id = theCartItem.id)
        if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
            this.computeCartTotals();
        }
    }


}
