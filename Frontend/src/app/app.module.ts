import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SocialLoginModule, GoogleLoginProvider } from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './auth/AuthGuard.service';
import { AuthInterceptor } from './auth/AuthInterceptor';

import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { HexComponent } from './hex/hex.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login.component';
import { MapsComponent } from './maps/maps.component';
import { TileInfoComponent } from './hex/tile-info/tile-info.component';
import { ValueSelectorComponent } from './hex/value-selector/value-selector.component';

@NgModule({
  declarations: [
    AboutComponent,
    AdminComponent,
    AppComponent,
    HexComponent,
    HomeComponent,
    LoginComponent,
    MapsComponent,
    TileInfoComponent,
    ValueSelectorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatToolbarModule,
    NgbModule,
    ReactiveFormsModule,
    SocialLoginModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '706588217519-d997qa9l0iolpgqn22khotv3vtl2v8so.apps.googleusercontent.com'
            ),
          },
        ],
      },
    },
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
