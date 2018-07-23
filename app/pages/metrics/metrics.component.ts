import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'metrics',
  moduleId: module.id,
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  constructor(private routerExtensions: RouterExtensions) {}

  ngOnInit(): void {}

  teamTapped() {
    this.routerExtensions.navigate(['/teams'], {
      clearHistory: true,
      transition: {
        name: 'fade'
      }
    });
  }

  tasksTapped() {
    this.routerExtensions.navigate(['/task-list'], {
      clearHistory: true,
      transition: {
        name: 'fade'
      }
    });
  }
}
