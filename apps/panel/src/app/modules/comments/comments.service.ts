import { Injectable, EventEmitter } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  dataCategories = new EventEmitter<any>();
  private categories = [];
  private loading: boolean

  constructor(private rest: RestService) {
    this.getCategories()
  }

  getCategories() {
    if (!this.categories?.length && !this.loading) {
      this.loading = true;
      this.rest.get('categories?limit=100').subscribe((res) => {
        const { docs } = res;
        this.categories = docs;
        this.dataCategories.emit(docs);
        this.loading = false
      });
    } else {
      return this.categories
    }
  }
}
