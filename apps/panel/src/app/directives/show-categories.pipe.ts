import { Pipe, PipeTransform } from '@angular/core';
import { CommentsService } from '../modules/comments/comments.service';
import * as  _ from 'lodash'

@Pipe({
  name: 'showCategories'
})
export class ShowCategoriesPipe implements PipeTransform {
  private categories = []
  constructor(private service: CommentsService) {
    this.categories = this.service.getCategories()
  }

  loadCategories() {
    this.categories = this.service.getCategories()
    this.service.dataCategories.subscribe(res => {
      this.categories = res
    })
  }

  transform(value: [String], ...args: unknown[]): any {
    const array = _.map(value, i => _.find(this.categories, o => o._id === i))
    console.log(array)
    return array
  }

}