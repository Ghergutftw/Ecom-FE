import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ProductListComponent} from './components/product-list/product-list.component';
import {HttpClientModule} from '@angular/common/http';
import {ProductService} from './services/product.service';

import {Router, RouterModule, Routes} from '@angular/router';
import {ProductCategoryMenuComponent} from './components/product-category-menu/product-category-menu.component';
import {SearchComponent} from './components/search/search.component';
import {ProductDetailsComponent} from './components/product-detailes/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CartStatusComponent} from './components/cart-status/cart-status.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {ReactiveFormsModule} from "@angular/forms";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {LoginComponent} from './components/login/login.component';
import {LoginStatusComponent} from './components/login-status/login-status.component';
import configFile from "./config/config-file";
import OktaAuth from "@okta/okta-auth-js";
import {OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent} from "@okta/okta-angular";

const oktaConfig = configFile.oidc;

const oktaConfigV2 = Object.assign({
    onAuthRequired: (oktaAuth : any, injector : Injector) => {
        const router = injector.get(Router)
        router.navigate(['/login'])
    }
},configFile.oidc)

const oktaAuth = new OktaAuth(oktaConfigV2);


const routes: Routes = [
    {path: '', redirectTo: '/products', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'login/callback', component: OktaCallbackComponent},
    {path: 'products', component: ProductListComponent},
    {path: 'products/:id', component: ProductDetailsComponent},
    {path: 'cart-details', component: CartDetailsComponent},
    {path: 'category', component: ProductListComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'category/:id', component: ProductListComponent},
    {path: 'search/:keyword', component: ProductListComponent},
    {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
    declarations: [
        AppComponent,
        ProductListComponent,
        ProductCategoryMenuComponent,
        SearchComponent,
        ProductDetailsComponent,
        CartStatusComponent,
        CartDetailsComponent,
        CheckoutComponent,
        LoginComponent,
        LoginStatusComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        OktaAuthModule
    ],
    providers: [ProductService,{provide:OKTA_CONFIG,useValue:{oktaAuth}}],
    bootstrap: [AppComponent]
})

export class AppModule {
}
