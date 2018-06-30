import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';

import { TaskListComponent } from '~/components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '~/shared/tasks/tasks.service';
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
  declarations: [AppComponent, TaskListComponent, TaskFormComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [TaskService]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
