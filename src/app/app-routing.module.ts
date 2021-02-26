import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ExploreComponent } from './pages/explore/explore.component'
import { LandingComponent } from './pages/landing/landing.component'
import { MyTacosComponent } from './pages/my-tacos/my-tacos.component'
import { WatchlistComponent } from './pages/watchlist/watchlist.component'

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'my-tacos', component: MyTacosComponent },
  { path: 'watchlist', component: WatchlistComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
