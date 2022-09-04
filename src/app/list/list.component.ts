import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarWarsService } from '../star-wars.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
  characters = [];
  activatedRoute: ActivatedRoute;
  swService: StarWarsService;
  loadedSide = 'all';
  subscribtion;

  constructor(activatedRoute: ActivatedRoute, swService: StarWarsService) {
    this.activatedRoute = activatedRoute;
    this.swService = swService;
  }

  ngOnInit() {
    this.swService
      .fetchCharacters()
      .pipe(
        map((data: any) => {
          return data.results
            .map((res: any) => ({
              ...res,
              side: '',
            }))
            .slice(0, 5);
        })
      )
      .subscribe((data) => {
        this.characters = data;
        this.swService.characters$.next(data);
      });
    this.activatedRoute.params.subscribe((params) => {
      this.characters = this.swService.getCharacters(params.side);
      this.loadedSide = params.side;
    });

    this.subscribtion = this.swService.charactersChanged.subscribe(() => {
      this.characters = this.swService.getCharacters(this.loadedSide);
    });
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
