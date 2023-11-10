import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.isLoggedIn = this.authService.isUserLoggedIn$.value;
    this.authService.isUserLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }
  logout() {
    this.authService.logout();
  }
  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
