import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `
    <div class="container">
    <div>
      <a class="btn btn-default" routerLink="/home">Home</a>
      <a class="btn btn-info" routerLink="/about">About</a>
    </div>
  
    <div class="well">Angular Universal App</div>
    <router-outlet></router-outlet>
    <footer>Angular Unuversal App</footer>
  </div>
  `
})
export class AppComponent {

}
