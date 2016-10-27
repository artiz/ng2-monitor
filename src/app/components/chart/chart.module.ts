import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineChart } from './line-chart';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LineChart
  ],
  providers: [
  ],
  declarations: [
    LineChart
  ]
})
export class ChartModule { }



