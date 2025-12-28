import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isLoggedIn = false;
  userRole: string | null = null;
  currentLang = 'fr';
  isLangMenuOpen = false;

  toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  constructor(private auth: AuthService, private router: Router, private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
    this.currentLang = 'fr';
  }

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
    this.auth.getRole().subscribe(role => {
      this.userRole = role;
    });
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);

    // Handle RTL
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.dir = dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
