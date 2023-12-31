import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'thirdparty-signup',
    templateUrl: './thirdparty-signup.component.html',
    styleUrls: ['./thirdparty-signup.component.css']
})

export class ThirdPartySignUpComponent implements OnInit {

    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

    showProgressBar: boolean = false;
    progress: number = 0;
    loginInput: string = "https://login.inrupt.com";
    webID: string = "";
    name: string = "";
    email: string = "";
    organisationType: string = "";
    description: string = "";

    navigateToHomePage() {
        this.router.navigateByUrl('/login');
    }

    submitForm() {
        localStorage.setItem('name', this.name);
        localStorage.setItem('email', this.email);
        localStorage.setItem('organisationType', this.organisationType);
        localStorage.setItem('description', this.description);
        localStorage.setItem('loginInput', this.loginInput);
        window.location.href = "http://localhost:3000/api/v1/auth/thirdparty-signup?issuer=" + this.loginInput;
    }

    ngOnInit() {
        this.name = localStorage.getItem('name') || "";
        this.email = localStorage.getItem('email') || "";
        this.organisationType = localStorage.getItem('organisationType') || "";
        this.description = localStorage.getItem('description') || "";
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('organisationType');
        localStorage.removeItem('description');
        console.log("Signing Up");
        this.route.queryParams.subscribe((params) => {
            const isLoggedIn = params["isLoggedIn"];
            const sessionID = params["sessionId"];
            if (isLoggedIn) {
                this.webID = params["webId"];
                this.showProgressBar = true;
                const interval$ = interval(500);
                const subscription = interval$.subscribe(() => {
                    this.progress += 10;
                    if (this.progress >= 100) {
                        this.showProgressBar = false;
                        subscription.unsubscribe();
                        this.progress = 0;
                    }
                });
                if (this.name && this.email && this.organisationType && this.description && this.webID) {
                    this.userService.registerThirdParty(this.webID, this.name, this.email, this.organisationType, this.description, sessionID).subscribe(
                        (response) => {
                            console.log(response);
                            localStorage.setItem("webID", this.webID);
                            localStorage.setItem("isLoggedIn", "true");
                            localStorage.setItem("userType", "THIRDPARTY");
                            this.router.navigate(['/home']);
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                }
            }
        });
    }
}