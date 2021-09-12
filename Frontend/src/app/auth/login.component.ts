import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';

import { AuthService } from './AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private socialAuthService: SocialAuthService) {}

  ngOnInit() {}

  loginWithGoogle(): void {
    //  TODO: save the token that you got from your REST API in your preferred location i.e. as a Cookie or LocalStorage as you do with normal login

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(() => {
      console.log(`LoginComponent: received feedback from Google`);
      return this.router.navigate(['home']);
    });
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    //  https://www.javacodegeeks.com/2019/06/angular-facebook-login-example.html
    //  https://morioh.com/p/a83878b5f50a
  }

  signInWithMictosoft(): void {
    //  https://github.com/abacritt/angularx-social-login/blob/HEAD/microsoft-provider.md
  }

  signOut(): void {
    this.socialAuthService.signOut(true);
  }
}
