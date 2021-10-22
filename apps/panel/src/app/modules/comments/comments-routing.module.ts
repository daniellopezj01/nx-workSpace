import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from 'src/app/services/auth/auth-guard.guard';
import { AddCommentComponent } from './pages/add-comment/add-comment.component';
import { ListCommentsComponent } from './pages/list-comments/list-comments.component';

const routes: Routes = [
  { path: '', component: ListCommentsComponent },
  {
    path: ':id',
    component: AddCommentComponent,
    canDeactivate: [AuthGuardGuard],
  },
  {
    path: 'new',
    component: ListCommentsComponent,
    pathMatch: 'full',
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommentsRoutingModule { }
