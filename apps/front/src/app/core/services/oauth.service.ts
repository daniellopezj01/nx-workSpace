import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  public readonly url: string = environment.api;

  constructor(public http: HttpClient) { }

  public login({ email, password }: any): Observable<any> {
    return this.http.post(`${this.url}/login`, {
      email,
      password,
    });
  }
  public register(body: any): Observable<any> {
    return this.http.post(`${this.url}/register`, body);
  }

  public exchange({ accessToken }: any): Observable<any> {
    return this.http.post(`${this.url}/exchange`, { accessToken });
  }
}
