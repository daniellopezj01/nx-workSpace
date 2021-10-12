import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealsRoutingModule } from './deals-routing.module';
import { TestTemplatesComponent } from './test-templates/test-templates.component';

@NgModule({
  declarations: [TestTemplatesComponent],
  imports: [CommonModule, DealsRoutingModule],
})
// @ts-ignore
export class DealsModule {}
