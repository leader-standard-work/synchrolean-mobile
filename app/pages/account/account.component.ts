import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
    selector: 'account',
    moduleId: module.id,
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
  })
  export class AccountComponent implements OnInit {
    constructor(private routerExtensions: RouterExtensions,){}

    ngOnInit(): void {


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