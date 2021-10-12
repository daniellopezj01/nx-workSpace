import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  data: any;
  score: number = 0;
  constructor() { }

  public setMainData(data: any) {
    this.data = data;
  }

  public get getMainData() {
    return this.data;
  }

  public setScore(score: number) {
    this.score = score;
  }

  public get getScore() {
    return this.score;
  }

  public clearReviews() {
    this.data = this.score = 0;
  }
}
