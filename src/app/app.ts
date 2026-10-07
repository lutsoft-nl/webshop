import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: '<main><router-outlet /></main>',
  styles: 'main { max-width: 960px; margin: 0 auto; padding: 1rem; font-family: sans-serif; }',
})
export class App {}
