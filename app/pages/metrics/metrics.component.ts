import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Frame } from 'tns-core-modules/ui/frame/frame';
import { Observable } from 'rxjs';
import { MetricsService } from '~/shared/services/metrics.service';
import { dateProperty } from 'tns-core-modules/ui/date-picker/date-picker';
import { endTimeRange } from '@angular/core/src/profile/wtf_impl';
import { AuthenticationService } from '~/shared/services/auth.service';
//import { PieDataModel } from '/../data-models/pie-data-model';

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
