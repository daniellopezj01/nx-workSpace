import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { ContainerBlogComponent } from './pages/container-blogs/container-blog.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ContainerBlogComponent],
  imports: [CommonModule, BlogRoutingModule, SharedModule, TranslateModule],
  providers: [DatePipe],
})
// @ts-ignore
export class BlogModule {}
