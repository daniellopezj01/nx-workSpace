import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatsComponent } from './pages/chats/chats.component';
const routes: Routes = [
  {
    path: ':hash',
    component: ChatsComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: ChatsComponent,
    redirectTo: '/inbox/chats',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxRoutingModule {}
