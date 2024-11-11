import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  startTransfer(service: string): void {
    console.log(`Starting transfer for ${service}`);
    // Add your transfer logic here
  }
}
