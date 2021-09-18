import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Role } from './auth/role';

import { HexComponent } from './hex/hex.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { ArenaComponent } from './arena/arena.component';
import { MapsComponent } from './maps/maps.component';
import { PingballComponent } from './pingball/pingball.component';
import { LoginComponent } from './auth/login.component';
import { AuthGuardService } from './auth/AuthGuard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService], data: { role: Role.admin } },
  { path: 'arena', component: ArenaComponent },
  { path: 'home', component: HomeComponent },
  { path: 'pingball', component: PingballComponent },
  { path: 'hex', component: HexComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'maps', component: MapsComponent, canActivate: [AuthGuardService] },
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
