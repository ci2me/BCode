import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

// services
import { UserService } from './services/user.service';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { MemberSignUpComponent } from './auth/member-signup/member-signup.component';
import { ThirdPartySignUpComponent } from './auth/thirdparty-signup/thirdparty-signup.component';
import { HomeComponent } from './home/home.component';
import { MemberHomeComponent } from './home/member-home/member-home.component';
import { MenuComponent } from './features/menu/menu.component';
import { ThirdPartyHomeComponent } from './home/thirdparty-home/thirdparty-home.component';
import { AdminHomeComponent } from './home/admin-home/admin-home.component';
import { ProfileComponent } from './profile/profile.component';
import { MemberProfileComponent } from './profile/member-profile/member-profile.component';
import { ThirdPartyProfileComponent } from './profile/thirdparty-profile/thirdparty-profile.component';
import { AdminProfileComponent } from './profile/admin-profile/admin-profile.component';
import { AgreementComponent } from './agreement/agreement.component';
import { CommentSectionComponent } from './features/comments/comments.component';
import { PreferenceVotingComponent } from './features/preference-voting/preference-voting.component';
import { RequestCardComponent } from './features/request-card/request-card.component';
import { SubmitRequestComponent } from './submit-request/submit-request.component';
import { SubmitOfferComponent } from './submit-offer/submit-offer.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { TabsComponent } from './features/tabs/tabs.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MemberSignUpComponent,
        ThirdPartySignUpComponent,
        MenuComponent,
        HomeComponent,
        MemberHomeComponent,
        ThirdPartyHomeComponent,
        AdminHomeComponent,
        ProfileComponent,
        MemberProfileComponent,
        ThirdPartyProfileComponent,
        AdminProfileComponent,
        AgreementComponent,
        CommentSectionComponent,
        PreferenceVotingComponent,
        RequestCardComponent,
        SubmitRequestComponent,
        SubmitOfferComponent,
        ProjectPageComponent,
        TabsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatGridListModule,
        MatMenuModule,
        MatIconModule,
        MatButtonToggleModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatSelectModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatCardModule,
        MatListModule,
        MatTabsModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        ScrollingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore())
    ],
    exports: [
        MenuComponent,
        CommentSectionComponent
    ],
    providers: [UserService],
    bootstrap: [AppComponent]
})
export class AppModule { }

/*

The app.module.ts file is the main module of your Angular application. It's where you declare which components, directives, and pipes belong to the application. It's also where you specify which other modules and services your application uses. Here's a breakdown of what each part of your app.module.ts file does:

The import statements at the top import various modules, components, and services that your application uses. For example, BrowserModule is Angular's module for browser-specific services, AppRoutingModule is your application's routing module, AppComponent is your application's main component, and LoginComponent is a component for a login page.

The @NgModule decorator is used to define a module. It takes a metadata object that tells Angular how to compile and run the module.

The declarations array is where you declare which components, directives, and pipes belong to this module. Angular uses this array to know which selectors are associated with which components.

The imports array is where you import other modules that your module needs. Components in your module can use the directives, components, and pipes that these imported modules export.

The providers array is where you specify the services that this module provides. These services become available for injection into any component, directive, pipe, or service that is part of the app.

The bootstrap array is where you define the root component of the module. The root component is the first component to be loaded when the application starts.

In your specific app.module.ts file, you're declaring several components like AppComponent, LoginComponent, HomePageComponent, etc. You're also importing several modules like BrowserModule, AppRoutingModule, BrowserAnimationsModule, etc. You're providing the AuthserviceService service, and you're bootstrapping the AppComponent.

The provideFirebaseApp and provideFirestore are used to initialize Firebase and Firestore in your application, using the configuration from your environment file.
*/