import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from '../components/chart';

import { ApiService } from '../services/api';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    HomeRoutingModule
  ],
  providers: [
    ApiService
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
