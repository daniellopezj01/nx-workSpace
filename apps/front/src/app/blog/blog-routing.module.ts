import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerBlogComponent } from './pages/container-blogs/container-blog.component';

const routes: Routes = [
  {
    path: ':id',
    component: ContainerBlogComponent,
  },
  { path: '**', redirectTo: '/notFound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
