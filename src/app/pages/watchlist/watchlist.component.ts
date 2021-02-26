import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Taco, StoreService } from 'src/app/services/store/store.service'

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit {
  public tacos$: Observable<Taco[]> = new Observable()
  public tacosCount$: Observable<number> = new Observable()

  constructor(private readonly storeService: StoreService) {
    this.storeService.setView('watchlist')
    this.storeService.setSortType('ID')
    this.storeService.setSortDirection('asc')
    this.storeService.setSearchString('')
    this.tacos$ = this.storeService.tacos$
    this.tacosCount$ = this.storeService.tacosCount$
  }

  ngOnInit(): void {}
}
