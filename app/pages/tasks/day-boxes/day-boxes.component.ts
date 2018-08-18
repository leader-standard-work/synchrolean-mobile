import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Task } from '~/shared/models/task';

@Component({
  selector: 'day-boxes',
  moduleId: module.id,
  templateUrl: './day-boxes.component.html',
  styleUrls: ['./day-boxes.component.css']
})
export class DayBoxesComponent implements OnInit {
  private initialized: boolean = false;

  @Input()
  weekdays: number;
  @Output()
  selection = new EventEmitter<number>();

  @ViewChild('SUN')
  sundayBox: ElementRef;
  @ViewChild('MON')
  mondayBox: ElementRef;
  @ViewChild('TUE')
  tuesdayBox: ElementRef;
  @ViewChild('WED')
  wednesdayBox: ElementRef;
  @ViewChild('THU')
  thrusdayBox: ElementRef;
  @ViewChild('FRI')
  fridayBox: ElementRef;
  @ViewChild('SAT')
  saturdayBox: ElementRef;

  constructor() {}

  ngOnInit() {
    console.log('Weekdays ', this.weekdays);
    if (this.weekdays & 0b1) {
      this.sundayBox.nativeElement.checked = true;
    }
    if (this.weekdays & 0b10) {
      this.mondayBox.nativeElement.checked = true;
    }
    if (this.weekdays & 0b100) {
      this.tuesdayBox.nativeElement.checked = true;
    }
    if (this.weekdays & 0b1000) {
      this.wednesdayBox.nativeElement.checked = true;
    }
    if (this.weekdays & 0b10000) {
      this.thrusdayBox.nativeElement.checked = true;
    }
    if (this.weekdays & 0b100000) {
      this.fridayBox.nativeElement.checked = true;
    }
    if (this.weekdays & 0b1000000) {
      this.saturdayBox.nativeElement.checked = true;
    }
    this.initialized = true;
  }

  onChecked(day: number) {
    if (this.initialized) {
      this.setWeekday(day);
      this.selection.emit(this.weekdays);
    }
  }

  setWeekday(day: number) {
    if (day > 0 && day < 8) {
      const d = 1 << (day - 1);
      this.weekdays ^= d;
    }
  }
}
