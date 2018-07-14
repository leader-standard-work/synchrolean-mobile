import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { TeamListComponent } from '~/pages/teams/team-list/team-list.component';

@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [TeamListComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class Team{}