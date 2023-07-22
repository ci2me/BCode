import { Injectable, OnInit } from '@angular/core';
import { Session } from '@inrupt/solid-client-authn-browser';
import { User } from '../model/user-info';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DataAccessRequest } from '../model/data-access-request';
import { SolidDataset, getSolidDataset, getThing, ThingPersisted } from '@inrupt/solid-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private REST_API_SERVICE = "http://localhost:3000/api/v1/";

    session = new Session();

    constructor(private http: HttpClient) { }

    login(): Observable<any> {
        return this.http.get('http://localhost:3000/login');
    }

    checkUser(webID: string): Observable<any> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        const params = new HttpParams().set('webID', webID);
        return this.http.get('http://localhost:3000/api/v1/user/checkUser', { headers, params });
    }

    registerMember(webID: string, name: string, email: string, dataSource: string, sessionID: string): Observable<any> {
        console.log("registering Member");
        console.log("sessionID", sessionID);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post('http://localhost:3000/api/v1/user/registerMember', { webID, name, email, dataSource, sessionID }, { headers });
    }

    registerThirdParty(webID: string, name: string, email: string, organisationType: string, description: string, sessionID: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post('http://localhost:3000/api/v1/user/registerThirdParty', { webID, name, email, organisationType, description, sessionID }, { headers });
    }

}

