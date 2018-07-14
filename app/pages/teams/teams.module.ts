import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { MembersComponent } from '~/pages/teams/members/members.component';


@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [MembersComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class Teams{}