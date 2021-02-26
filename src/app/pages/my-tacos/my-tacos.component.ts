import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { StoreService, Taco } from 'src/app/services/store/store.service'

@Component({
  selector: 'app-my-tacos',
  templateUrl: './my-tacos.component.html',
  styleUrls: ['./my-tacos.component.scss'],
})
export class MyTacosComponent implements OnInit {
  public tacos$: Observable<Taco[]> = new Observable()
  public tacosCount$: Observable<number> = new Observable()

  constructor(private readonly storeService: StoreService) {
    this.storeService.setView('my-tacos')
    this.storeService.setSortType('ID')
    this.storeService.setSortDirection('asc')
    this.storeService.setSearchString('')
    this.tacos$ = this.storeService.tacos$
    this.tacosCount$ = this.storeService.tacosCount$
  }

  ngOnInit(): void {}
}
