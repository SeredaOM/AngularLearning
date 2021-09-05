import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HexComponent } from './hex/hex.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ArenaComponent } from './arena/arena.component';
import { MapsComponent } from './maps/maps.component';
import { PingballComponent } from './pingball/pingball.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pingball', component: PingballComponent },
  { path: 'hex', component: HexComponent },
  { path: 'arena', component: ArenaComponent },
  { path: 'maps', component: MapsComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
