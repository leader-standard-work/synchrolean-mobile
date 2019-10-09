import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Frame } from 'ui/frame';
import { Observable } from 'rxjs';
import { MetricsService } from '~/shared/services/metrics.service';
import { AuthenticationService } from '~/shared/services/auth.service';

@Component({
  selector: 'metrics',
  moduleId: module.id,
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  public TeamCompletionRate$: number;
  public MemberCompletionRate$: number;
  public userEmail: string;

  public pageData$: Observable<number>;
  constructor(
    private authService: AuthenticationService,
    private metricsService: MetricsService,
    private routerExtensions: RouterExtensions,
    private frame: Frame
) {}

  ngOnInit(): void {
    this.userEmail = this.authService.email;
    let startDate = new Date();
    let endDate = new Date();

    startDate.setDate(startDate.getDate()-7);
    this.metricsService.getTeamCompletionRate(1,startDate,endDate).subscribe(
      response => {this.TeamCompletionRate$= response}, error => {console.error("Failed to get TeamCompletionRate in ngInit")});

    this.metricsService.getMemberCompletionRate("a",startDate,endDate).subscribe(
      response => {this.MemberCompletionRate$= response}, error => {console.error("Failed to get MemberCompletionRate in ngInit")});
    console.log("Values are: ", this.TeamCompletionRate$, this.MemberCompletionRate$)
  }

  teamTapped() {
    this.routerExtensions.navigate(['/teams'], {
      clearHistory: true,
      animated: false
    });
  }

  tasksTapped() {
    this.routerExtensions.navigate(['/task-list'], {
      clearHistory: true,
      animated: false
    });
  }
}
