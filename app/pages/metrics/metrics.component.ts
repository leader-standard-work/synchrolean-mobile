import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Frame } from 'ui/frame';
import { Observable } from 'rxjs';


@Component({
  selector: 'metrics',
  moduleId: module.id,
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  public pageData$: Observable<number>;
  constructor(
    private routerExtensions: RouterExtensions,
    private frame: Frame
) {}

  ngOnInit(): void {
    //grab data from backend 
    //this.pageData$ = this.pageData$.
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
