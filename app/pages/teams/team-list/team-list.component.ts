import { Component, OnInit } from '@angular/core';
import { Team } from '~/shared/teams/team';
import { Observable } from 'rxjs';
import { ServerService } from '~/shared/server/server.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { teams } from '~/shared/dummyData';

@Component({
  selector: 'team-list',
  moduleId: module.id,
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  public teams$: Array<Team>;
  public names: Array<string>;

  constructor(private server:ServerService, private routerE:RouterExtensions){
    this.teams$ = new Array<Team>();
    this.names = new Array<string>();
  }

  ngOnInit(): void {
    //disclaimer, this is testing with dummy data
      //this.teams$ = this.server.getTeams()

    // if(this.teams$ === undefined){
        this.teams$ = JSON.parse(teams);
        
        this.getNames();
    // }
    }

  getNames(){
      this.teams$.forEach((value)=>{
        this.names.push(value.TeamName);
      });
  }

  onTap(){
    this.routerE.navigate(['/Members'],{
      transition:{
        name: "slideLeft"
      }
    });
  }

  tasksTapped() {
    this.routerE.navigate(['/task-list'], {
      clearHistory: true,
      transition: {
        name: 'fade'
      }
    });
  }


}
