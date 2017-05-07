import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export class User {
  name: string;
  email: string;
  uid: number;
 
  constructor(name: string, email: string, uid: number) {
    this.name = name;
    this.email = email;
    this.uid = uid;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  userId : number;
  constructor (private http: Http) {}
  //headers: Headers;
  //resp;
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let data = {email: credentials.email, password: credentials.password};
        let serviceEndpoint = 'http://169.46.151.170:8080/auth';
        this.http.post(serviceEndpoint, JSON.stringify(data), {headers: new Headers({'Content-Type': 'application/json'})})
                  .map(res => res.json())
                  .subscribe((data) => {
                      
                      console.log("User id is : " + data.entity);
                      let access = (data.entity != 0 && !isNaN(data.entity));
                      console.log("access is : " + access);
                      this.currentUser = new User('Mig', credentials.email , data.entity);
                      observer.next(access);
                      observer.complete();
                  });
      });
    }
  }

  public myData(uid : number){
    this.userId = uid;
  }

  public getUserId() : number {
    return this.userId;
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
