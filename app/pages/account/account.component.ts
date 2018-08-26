import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { AuthenticationService } from '~/shared/services/auth.service';

@Component({
    selector: 'account',
    moduleId: module.id,
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
  })
  export class AccountComponent implements OnInit {
    constructor(
      private routerExtensions: RouterExtensions,
      private authService: AuthenticationService,
    ){}

    ngOnInit(): void {
      if (!this.authService.isLoggedIn()){
        this.routerExtensions.navigate(['/login'], {
          transition: {
            name: 'slideTop'
          },
          clearHistory: true
        });
      }
    }

    isLoggedIn(): boolean {
      return this.authService.isLoggedIn();
    }

    editTapped() {
      this.routerExtensions.navigate(['/edit-account'], {
        clearHistory: true,
        animated: false
      });
    }

    notificationsTapped() {
      this.routerExtensions.navigate(['/notifications'], {
        clearHistory: true,
        animated: false
      });
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