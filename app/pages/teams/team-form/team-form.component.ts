//This file contains the team-form component, used in the creation of a new team
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { action, alert } from 'tns-core-modules/ui/dialogs/dialogs';
import { TeamService } from '~/shared/teams/teams.service';
import { Team } from '~/shared/teams/team';

@Component({
  selector: 'team-form',
  moduleId: module.id,
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.html']
})

export class TeamFormComponent implements OnInit {
  private teamService: TeamService;
  private pageRoute: PageRoute;
  private routerExtensions: RouterExtensions;
  private formBuilder: FormBuilder;
  private teamFromGroup: FormGroup;
  
  public teamFormGroup: FormGroup;
  public team: Team;
  public teamTitle: string;

  constructor(
    teamService: TeamService,
    formBuilder: FormBuilder,
    pageRoute: PageRoute,
    routerExtensions: RouterExtensions
  ){
    this.teamService = teamService;
    this.formBuilder = formBuilder;
    this.pageRoute = pageRoute;
    this.routerExtensions = routerExtensions;

    //this.pageroute.activatedRoute
    //come back to this later

  }
  ngOnInit(): void {
    this.teamTitle = 'New Team';
    let teamDesc = '';

    this.teamFormGroup = this.formBuilder.group({
        //teamName: [name, Validators.required],
        //teamDesc
    })

  }

  onSave(){
      let teamName = this.teamFormGroup.value.teamName;
      let teamDesc = this.teamFormGroup.value.teamDesc;
      let options ={
          title: 'Description Required',
          okButtonText: 'Ok'
      };

      if (teamName !== '' && teamDesc !== ''){
          //switch(this.mode)
          //case Mode.new
          options.title = 'New team created';
          //note, the new Team expect args of Id (team ID), team name, team description, and ownerID
          //the team ID and owner ID are not correct yet and use the dummy value of 1
          let team: Team = new Team(1, teamName, teamDesc, 1);
          //this.teamService.addTeam(team);
          this.teamFormGroup.reset();
          alert(options);
         
      }
  }
}