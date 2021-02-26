import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Taco, StoreService } from 'src/app/services/store/store.service'

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  public tacos$: Observable<Taco[]> = new Observable()
  public tacosCount$: Observable<number> = new Observable()

  constructor(private readonly storeService: StoreService) {
    this.storeService.resetFilters()
    this.storeService.setView('my-tacos')
    this.storeService.setSortType('ID')
    this.storeService.setSortDirection('asc')
    this.storeService.setSearchString('')
    this.tacos$ = this.storeService.tacos$.pipe(map((m) => m.slice(0, 7)))
    this.tacosCount$ = this.storeService.tacosCount$
  }

  ngOnInit(): void {}
}
