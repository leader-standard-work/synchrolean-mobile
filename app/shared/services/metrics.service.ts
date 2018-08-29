import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable, of } from 'rxjs';

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
      //
  }
  
  //GetTeamCompletionRate gets the completion rate of a team from a specified date range
  public getTeamCompletionRate(teamId: number, startDate: string, endDate: string): Observable<number> {
    const endpoint = this.authService.url + `/api/tasks/metrics/team/${teamId}/${startDate}/${endDate}`;
    return this.http.get<any>(endpoint);
  }

  //GetMemberCompletionRate gets the completion rate of an individual from a specified date range
  public getMemberCompletionRate(teamid: number, memberEmail: string, startDate: string, endDate: string): Observable<number> {
    const endpoint = this.authService.url + `/api/tasks/metrics/user/team/${teamid}/${startDate}/${endDate}/${memberEmail}`;
    return this.http.get<number>(endpoint);   
  }
}