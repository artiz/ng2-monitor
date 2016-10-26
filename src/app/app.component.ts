import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `
    <div class="container">
    <div>
      <a class="btn btn-default" routerLink="/home">Home</a>
      <a class="btn btn-default" routerLink="/about">About</a>
    </div>

    <div class="well well-small">Hello Angular Universal App</div>
    <router-outlet></router-outlet>
    <footer>Angular Unuversal App</footer>
  </div>
  `
})
export class AppComponent {

}
