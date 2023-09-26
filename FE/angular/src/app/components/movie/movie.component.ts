import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { DataService, MovieComplete } from '../../services/data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html'
})
export class MovieComponent implements OnDestroy, OnInit {
  public movie: MovieComplete | undefined;
  movieId: string | null = '';
  private movieSubscription: Subscription;
  private destroy$ = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService) {}

  public ngOnInit() {
    this.movieId = this.activatedRoute.snapshot.paramMap.get('id');
    this.movieSubscription = this.dataService
      .getMovies()
      .pipe(
        takeUntil(this.destroy$),
        tap((movies) => {
          this.movie = movies.Search.find((movie) => movie.imdbID === this.movieId);
        })
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
