import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { MembersComponent } from '~/pages/teams/members/members.component';
import { MembersTasksComponent } from '~/pages/teams/members-tasks-list/member-tasks.component';


@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [MembersComponent, MembersTasksComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class Teams{}