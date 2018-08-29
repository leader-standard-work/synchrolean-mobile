import {
    Component,
    OnInit,
    Input,
    Output,
    ViewChild,
    ElementRef,
    EventEmitter,
    SimpleChanges
  } from '@angular/core';

  import { MetricsService } from '~/shared/services/metrics.service';

@Component({
      selector: 'metrics-item',
      moduleId: module.id,
      templateUrl: './metrics-item.component.html',
      styleUrls: ['./metrics-item.component.css']
  })

export class MetricsItemComponent implements OnInit {
  public value; //either the member completion rate or the team completion rate
  //@Input() frequency: number;
  @Input() teamId: number;
  @Input() memberId: string;

  constructor(private metricsService: MetricsService){}

  ngOnInit(){
  }

  //refreshMetrics is used with buttons on the metrics page to update
  //the values when a button is pressed.
  public refreshMetrics(frequency: Number){
        //initalize the start date and end date
        let startDate= new Date();
        let endDate = new Date();
    if (this.memberId != null){
        //we have a memberId, display member statistics
        switch(frequency){
            case 0:{  //Daily metrics
                //calculate the start date and end date
                startDate.setHours( 0,0,0,0 );

                break;
            }

            case 1:{  //Weekly metrics
                //calculate the start date and end date
                startDate.setDate(endDate.getDate() - endDate.getDay());
                break;
            }

            case 2:{  //Montly metrics
                //calculate the start date and end date
                startDate.setDate(1);
                break;
            }

            default:{  //Daily metrics (again)
                //Daily again
                startDate.setHours( 0,0,0,0 );
                break;
            }

        }

        // this.metricsService.getMemberCompletionRate(this.memberId, startDate, endDate).subscribe(
        //     response => {this.value= response}, error => {console.error("Failed to get MemberCompletionRate in ngInit")});
    } 
    else if(this.teamId != 0){
        //we have a teamId, display team metrics
        switch(frequency){
            case 0:{  //Daily metrics
                //calculate the start date and end date
                startDate.setHours( 0,0,0,0 );

                break;
            }

            case 1:{  //Weekly metrics
                //calculate the start date and end date
                startDate.setDate(endDate.getDate() - endDate.getDay());
                break;
            }

            case 2:{  //Montly metrics
                //calculate the start date and end date
                startDate.setDate(1);
                break;
            }

            default:{  //Daily metrics (again)
                //Daily again
                startDate.setHours( 0,0,0,0 );
                break;
            }
            
        }
        // this.metricsService.getTeamCompletionRate(this.teamId,startDate,endDate).subscribe(
        //     response => {this.value= response}, error => {console.error("Failed to get TeamCompletionRate in ngInit")});
    }
  }
  
  public metricsDailyTapped() {
    //Call the refreshMetrics function passing it 0, which represents daily
    this.refreshMetrics(0);
    //end
  }

  public metricsWeeklyTapped() {
    //Call the refreshMetrics function passing it 1, which represents weekly
    this.refreshMetrics(1);
    //end
  }

  public metricsMonthyTapped() {
    //Call the refreshMetrics function passing it 2, which represents monthy
    this.refreshMetrics(2);
    //end
  }

}