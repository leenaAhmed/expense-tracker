import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular/src/icons';

@Component({
  selector: 'app-empty-state',
  imports: [CommonModule, RouterLinkWithHref , LucideAngularModule],
  templateUrl: './empty-state.html',
})
export class EmptyState {

}
