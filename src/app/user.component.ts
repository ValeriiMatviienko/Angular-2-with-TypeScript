import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
    <input type="text" (input)="onUserInput($event)" [value]="name" />
    <!-- <input type="text" [(ngModel)]="name" /> -->
    <p>hello {{ name }}</p>
    <p>Im user</p>
    <app-user-detail></app-user-detail>
  `,
})
export class UserComponent {
  @Input() name;
  @Output() nameChanged = new EventEmitter<string>();

  onUserInput(event) {
    // this.name = e.target.value;
    this.nameChanged.emit(event.target.value);
  }
}
