import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { TaskListComponent } from '~/pages/tasks/task-list/task-list.component';
import { TaskFormComponent } from '~/pages/tasks/task-form/task-form.component';
import { TaskDetailComponent } from '~/pages/tasks/task-detail/task-detail.component';
import { LoginComponent } from '~/pages/account/login/login.component';
import { MembersComponent } from '~/pages/teams/members/members.component';
import { TeamListComponent } from '~/pages/teams/team-list/team-list.component';
import { TeamFormComponent } from '~/pages/teams/team-form/team-form.component';
import { MetricsComponent } from '~/pages/metrics/metrics.component';
import { RegisterComponent } from '~/pages/account/register/register.component';
import { MembersTasksComponent } from '~/pages/teams/members-tasks-list/members-tasks.component';
import { AccountComponent } from '~/pages/account/account.component';
import { EditAccountComponent } from '~/pages/account/edit-account/edit-account.component';
import { NotificationsComponent } from '~/pages/notifications/notifications.component';


const routes: Routes = [
  { path: '', redirectTo: '/task-list', pathMatch: 'full' },
  { path: 'task-list', component: TaskListComponent },
  { path: 'task-form', component: TaskFormComponent },
  { path: 'task-detail/:id', component: TaskDetailComponent },
  { path: 'task-edit/:id', component: TaskFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'Members', component: MembersComponent },
  { path: 'Members/:id', component: MembersComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'team-form', component: TeamFormComponent },
  { path: 'metrics', component: MetricsComponent },
  { path: 'members-tasks', component: MembersTasksComponent },
  { path: 'members-tasks/:id', component: MembersTasksComponent },
  { path: 'account', component: AccountComponent},
  { path: 'edit-account', component: EditAccountComponent},
  { path: 'notifications', component: NotificationsComponent}

];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
