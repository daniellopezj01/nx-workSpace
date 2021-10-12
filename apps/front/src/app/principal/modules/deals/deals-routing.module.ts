import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestTemplatesComponent } from './test-templates/test-templates.component';

const routes: Routes = [{
  path: '',
  component: TestTemplatesComponent,
}, ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class DealsRoutingModule { }
