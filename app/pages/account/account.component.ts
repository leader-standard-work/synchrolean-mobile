import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { AuthenticationService } from '~/shared/services/auth.service';
import { AccountService } from '~/shared/services/account.service';

@Component({
  selector: 'account',
  moduleId: module.id,
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public first: string;
  public last: string;
  public email: string;

  constructor(
    private routerExtensions: RouterExtensions,
    private authService: AuthenticationService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.routerExtensions.navigate(['/login'], {
        transition: {
          name: 'slideTop'
        },
        clearHistory: true
      });
    } else {
      this.accountService.getAccountByEmail(this.authService.email).subscribe(
        account => {
          console.log(account);
          this.first = account.firstName;
          this.last = account.lastName;
          this.email = account.email;
        },
        error => {
          console.error('could not get account', error);
        }
      );
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

  logoutTapped() {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
      this.routerExtensions.navigate(['/login'], {
        clearHistory: true,
        transition: {
          name: 'slideTop'
        }
      });
    }
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
