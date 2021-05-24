import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HexComponent } from './hex/hex.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ArenaComponent } from './arena/arena.component';
import { PingballComponent } from './pingball/pingball.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pingball', component: PingballComponent },
  { path: 'hex', component: HexComponent },
  { path: 'arena', component: ArenaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
