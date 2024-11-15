import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css'],
})
export class PlaylistCardComponent {
  @Input() playlist: { image: string; name: string } | undefined;
  @Input() selected: boolean = false;
  @Output() playlistClicked = new EventEmitter<void>();

  onCardClick(): void {
    this.playlistClicked.emit(); // Emit the click event when the card is clicked
  }
}
