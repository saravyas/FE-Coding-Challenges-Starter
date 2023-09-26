import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { DataService, MovieComplete, Error, MovieData, MovieCompleteError } from '../../services/data.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html'
})
export class MoviesComponent implements OnDestroy, OnInit {
  public currDecade: number | undefined;
  public decades: number[] = [];
  public filteredMovies: MovieComplete[] = [];
  public movies: MovieComplete[] = [];
  private moviesSubscription: Subscription;

  constructor(private dataService: DataService) {}

  /**
   * ng oninit to init comp
   */
  public ngOnInit(): void {
    this.initMovieSubscription();
  }

  /**
   * initialize subscription for movie
   */
  initMovieSubscription() {
    this.moviesSubscription = this.dataService
      .getMovies()
      .pipe(
        tap((data) => this.handleMovieData(data)),
        catchError((error: Error) => this.handleError(error))
      )
      .subscribe();
  }

  /**
   *get if error status and return error
   * @param error object as observable
   * @returns error observable
   */
  handleError(error: Error): Observable<MovieCompleteError> {
    let errorMessage: string;

    if (error.status) {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    } else {
      errorMessage = `An error occurred: ${error.message}`;
    }

    // Return a specific error message as MovieCompleteError type
    const movieError: MovieCompleteError = {
      errorMessage: errorMessage
    };

    return of(movieError);
  }

  /**
   *set decades and movies data
   * @param data as MovieData
   */
  handleMovieData(data: MovieData): void {
    this.decades = data.Decades;
    this.movies = data.Search;
    this.displayMovies();
  }

  public ngOnDestroy(): void {
    this.moviesSubscription.unsubscribe();
  }

  public displayMovies(decade?: number): void {
    if (!this.movies?.length) {
      this.filteredMovies = [];
      return;
    }

    this.currDecade = decade;
    this.filteredMovies = this.dataService.getFilteredMovies(this.movies, decade);
  }
}
