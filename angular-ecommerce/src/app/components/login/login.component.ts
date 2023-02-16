import {Component, Inject, OnInit} from '@angular/core';
import configFile from "../../config/config-file";
import {OKTA_AUTH} from "@okta/okta-angular";
import OktaAuth from "@okta/okta-auth-js";
import OktaSignIn from "@okta/okta-signin-widget";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    oktaSignin: any

    constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
        this.oktaSignin = new OktaSignIn({
            logo: 'assets/images/capybara-sexy.jpg',
            baseUrl: configFile.oidc.issuer.split('/oauth2')[0],
            clientId: configFile.oidc.clientId,
            redirectUri: configFile.oidc.redirectUri,
            authParams: {
                pkce: true,
                issuer: configFile.oidc.issuer,
                scopes: configFile.oidc.scopes
            }
        });
    }

    ngOnInit(): void {
        this.oktaSignin.remove();
        this.oktaSignin.renderEl(
            {el: '#okta-sign-in'},
            (response: any) => {
                if (response.scopes === 'SUCCESS') {
                    this.oktaSignin.signInWithRedirect();
                }
            },
            (error: any) => {
                throw error;
            }
        )
    }

}
