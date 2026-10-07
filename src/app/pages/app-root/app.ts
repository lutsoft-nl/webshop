import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';

@Component({
  imports: [RouterOutlet, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
