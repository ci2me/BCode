import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { login, getDefaultSession, handleIncomingRedirect, onSessionRestore } from "@inrupt/solid-client-authn-browser";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {

    constructor(private route: Router) { }

    loginInput?: string = "https://login.inrupt.com";
    validate: boolean = false;
    isLoggingIn: boolean = false;
    isSigningUp: boolean = false;
    session = getDefaultSession();

    async login() {
        this.isLoggingIn = true;
        this.isSigningUp = false;
    }

    async signUp() {
        this.isSigningUp = true;
        this.isLoggingIn = false;
    }

    async redirectToMemberSignUp() {
        this.route.navigate(['/memberSignUp']);
    }

    async redirectToThirdPartySignUp() {
        this.route.navigate(['/thirdPartySignUp']);
    }

    async confirmLogin() {
        window.location.href = "http://localhost:3000/login";
    }
}