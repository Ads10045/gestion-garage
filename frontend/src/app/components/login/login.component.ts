import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    currentLang = 'fr';

    constructor(private auth: AuthService, private router: Router, private translate: TranslateService) {
        // Initialize language
        this.translate.setDefaultLang('fr');
        this.translate.use('fr');
        this.currentLang = 'fr'; // Default

        if (this.auth.getCurrentUser()) {
            this.router.navigate(['/dashboard']);
        }
    }

    switchLanguage(lang: string) {
        this.currentLang = lang;
        this.translate.use(lang);

        // Handle RTL for Arabic
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.dir = dir;
        document.documentElement.lang = lang;
        document.documentElement.dir = dir; // Ensure html tag gets it too
    }

    onSubmit(): void {
        this.auth.login(this.username, this.password).subscribe(success => {
            if (success) {
                this.router.navigate(['/dashboard']);
            } else {
                this.error = this.translate.instant('LOGIN.ERROR');
            }
        });
    }
}
