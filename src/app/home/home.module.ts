import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from '../components/chart';

import { ApiService } from '../services/api';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    SharedModule,
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
