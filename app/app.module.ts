import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';

import { TaskListComponent } from '~/pages/tasks/task-list/task-list.component';
import { TaskFormComponent } from './pages/tasks/task-form/task-form.component';
import { TaskDetailComponent } from '~/pages/tasks/task-detail/task-detail.component';
import { LoginMainComponent } from '~/pages/account/login-main/login-main.component';

import { TaskService } from '~/shared/tasks/tasks.service';
import { DBService } from '~/shared/database/database.service';

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TNSCheckBoxModule
  ],
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskFormComponent,
    TaskDetailComponent,
    LoginMainComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [TaskService, DBService]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
