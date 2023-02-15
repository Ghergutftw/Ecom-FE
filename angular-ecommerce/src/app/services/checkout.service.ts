import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaserUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(public httpClient : HttpClient) { }

  placeOrder(purchase : Purchase) : Observable<any>{
    return this.httpClient.post<Purchase>(this.purchaserUrl,purchase)
  }
}
