import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, House , ChartColumnBig, UserRound , WalletMinimal} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-navigation',
  imports: [LucideAngularModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  readonly House= House;
  readonly chartColumnBig = ChartColumnBig;
  readonly UserRound = UserRound;
  readonly WalletMinimal =WalletMinimal;

  constructor(
    public router: Router,
    public authService: AuthService
  ) {}
}
