import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainReferredComponent } from './pages/main-referred/main-referred.component';
import { ReferredPageComponent } from './pages/referred-page/referred-page.component';
import { ReferredMainPageComponent } from './pages/referred-main-page/referred-main-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainReferredComponent,
    children: [
      {
        path: '',
        component: ReferredMainPageComponent,
      },
      {
        path: 'list',
        component: ReferredPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class ReferredRoutingModule {}
