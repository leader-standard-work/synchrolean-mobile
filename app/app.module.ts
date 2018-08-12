import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';

import { TaskService } from '~/shared/services/tasks.service';
import { DatabaseService } from '~/shared/services/database.service';
import { TeamService } from '~/shared/services/teams.service';
import { ServerService } from '~/shared/services/server.service';
import { AccountService } from '~/shared/services/account.service';
import { AuthenticationService } from '~/shared/services/auth.service';

import { AppRoutingModule } from '~/app.routing';
import { AppComponent } from '~/app.component';
import { TaskListComponent } from '~/pages/tasks/task-list/task-list.component';
import { TaskFormComponent } from '~/pages/tasks/task-form/task-form.component';
import { TaskDetailComponent } from '~/pages/tasks/task-detail/task-detail.component';
import { TaskItemComponent } from '~/pages/tasks/task-item/task-item.component';
import { LoginComponent } from '~/pages/account/login/login.component';
import { MembersComponent } from '~/pages/teams/members/members.component';
import { TeamListComponent } from '~/pages/teams/team-list/team-list.component';
import { TeamFormComponent } from '~/pages/teams/team-form/team-form.component';
import { MetricsComponent } from '~/pages/metrics/metrics.component';
import { RegisterComponent } from '~/pages/account/register/register.component';
import { MembersTasksComponent } from '~/pages/teams/members-tasks-list/members-tasks.component';
import { DayBoxesComponent } from '~/pages/tasks/day-boxes/day-boxes.component';

import { AuthInterceptor } from '~/shared/helpers/auth.interceptor';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from 'nativescript-angular/http';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptHttpClientModule,
    NativeScriptModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TNSCheckBoxModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskItemComponent,
    TaskFormComponent,
    TaskDetailComponent,
    LoginComponent,
    RegisterComponent,
    MembersComponent,
    TeamListComponent,
    TeamFormComponent,
    MetricsComponent,
    MembersTasksComponent,
    DayBoxesComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    TaskService,
    DatabaseService,
    ServerService,
    TeamService,
    AccountService,
    AuthenticationService
  ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
