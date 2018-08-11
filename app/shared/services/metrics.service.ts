import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '~/shared/services/auth.service';


@Injectable({
  providedIn: 'root'
})

export class MetricsService {
  //variables here
  constructor(
    private http: HttpClient, 
    private authService: AuthenticationService
  ){
      //constructor implementation
  }
}