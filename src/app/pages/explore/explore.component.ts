import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Color, StoreService } from 'src/app/services/store/store.service'

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  public colors$: Observable<Color[]> = new Observable()
  public colorsCount$: Observable<number> = new Observable()

  constructor(private readonly storeService: StoreService) {
    this.storeService.setView('explore')
    this.storeService.setSortType('name')
    this.storeService.setSortDirection('asc')
    this.storeService.setSearchString('')
    this.colors$ = this.storeService.colors$
    this.colorsCount$ = this.storeService.colorsCount$
  }

  ngOnInit(): void {}
}
