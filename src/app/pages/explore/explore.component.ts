import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Taco, StoreService } from 'src/app/services/store/store.service'

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  public tacos$: Observable<Taco[]> = new Observable()
  public tacosCount$: Observable<number> = new Observable()

  constructor(private readonly storeService: StoreService) {
    this.storeService.setView('explore')
    this.storeService.setSortType('ID')
    this.storeService.setSortDirection('asc')
    this.storeService.setSearchString('')
    this.tacos$ = this.storeService.tacos$
    this.tacosCount$ = this.storeService.tacosCount$
  }

  ngOnInit(): void {}
}
