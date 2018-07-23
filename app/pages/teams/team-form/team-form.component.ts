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
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {
  private teamFromGroup: FormGroup;

  public teamFormGroup: FormGroup;
  public team: Team;
  public teamTitle: string;

  constructor(
    private teamService: TeamService,
    private formBuilder: FormBuilder,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    this.teamTitle = 'New Team';
    let teamDesc = '';
    let name = '';

    this.teamFormGroup = this.formBuilder.group({
      teamName: [name, Validators.required],
      teamDesc: [teamDesc, Validators.required]
    });
  }

  onSave() {
    let teamName = this.teamFormGroup.value.teamName;
    let teamDesc = this.teamFormGroup.value.teamDesc;
    let options = {
      title: 'Description Required',
      okButtonText: 'Ok'
    };

    if (teamName !== '' && teamDesc !== '') {
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
