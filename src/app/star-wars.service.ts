import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { LogService } from './log.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class StarWarsService {
  characters$ = new BehaviorSubject<any>([]);

  private characters = [
    { name: 'Luke Skywalker', side: '' },
    { name: 'Darth Vader', side: '' },
  ];

  private logService: LogService;
  charactersChanged = new Subject<void>();
  http: HttpClient;

  constructor(logService: LogService, http: HttpClient) {
    this.logService = logService;
    this.http = http;
  }

  getShota() {
    return this.http
      .get('https://swapi.dev/api/people/')
      .pipe(
        map((data: any) => {
          return data.results.map((res: any) => ({
            ...res,
            side: '',
          }));
        })
      )
      .subscribe((data) => {
        this.characters = data;
        console.log(data);
      });
  }

  fetchCharacters(): any {
    return this.http.get('https://swapi.dev/api/people/');
  }

  getCharacters(chosenList) {
    if (chosenList === 'all') {
      return this.characters$.value.slice();
    }
    return this.characters$.value.filter((char) => {
      return char.side === chosenList;
    });
  }

  onSideChosen(charInfo) {
    const pos = this.characters$.value.findIndex((char) => {
      return char.name === charInfo.name;
    });
    this.characters$.value[pos].side = charInfo.side;
    this.charactersChanged.next();
    this.logService.writeLog(
      'Changed side of ' + charInfo.name + ', new side: ' + charInfo.side
    );
  }

  addCharacter(name, side) {
    const pos = this.characters$.value.findIndex((char) => {
      return char.name === name;
    });
    if (pos !== -1) {
      return;
    }
    const newChar = { name: name, side: side };
    this.characters$.value.push(newChar);
  }
}
