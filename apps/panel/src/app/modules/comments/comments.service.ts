import { RestService } from './../../services/rest/rest.service';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  dataCategories = new EventEmitter<any>();
  private categories = [];
  private loading = false;

  constructor(private rest: RestService) {
    this.getCategories()
  }

  getCategories() {
    if (!this.categories?.length && !this.loading) {
      this.loading = true;
      this.rest.get('categories?limit=100').subscribe((res: any) => {
        const { docs } = res;
        this.categories = docs;
        this.dataCategories.emit(docs);
        this.loading = false
      });
      return this.categories
    } else {
      return this.categories
    }
  }
}
