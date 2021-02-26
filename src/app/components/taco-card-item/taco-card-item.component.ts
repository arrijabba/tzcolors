import { state } from '@angular/animations'
import { Component, OnInit, Input } from '@angular/core'
import BigNumber from 'bignumber.js'

import { BsModalService } from 'ngx-bootstrap/modal'
import { first } from 'rxjs/operators'
import { BeaconService } from 'src/app/services/beacon/beacon.service'
import {
  Taco,
  isOwner,
  StoreService,
} from 'src/app/services/store/store.service'

type TacoState =
  | 'loading'
  | 'free'
  | 'auction'
  | 'unclaimed'
  | 'claim'
  | 'owned'
  | 'own'

@Component({
  selector: 'app-taco-card-item',
  templateUrl: './taco-card-item.component.html',
  styleUrls: ['./taco-card-item.component.scss'],
})
export class TacoCardItemComponent implements OnInit {
  @Input()
  taco: Taco | undefined

  @Input()
  isOwned: boolean = false

  @Input()
  isModal: boolean = false

  ownAddress: string | undefined

  categoryName: 'all' | 'Secret' | 'Hidden' | 'Rare' | 'Normal' = 'Normal'

  isOver: boolean = false

  state: TacoState = 'loading'

  constructor(
    private readonly modalService: BsModalService,
    private readonly beaconService: BeaconService,
    private readonly storeService: StoreService
  ) {}

  ngOnInit(): void {
    if (this.taco?.rarity) {
      this.categoryName = this.taco?.rarity
    }

    this.updateCardState()
  }

  openAddress(address: string) {
    window.open(`https://tezblock.io/account/${address}`, '_blank')
  }

  toggleFavorite() {
    if (this.taco) {
      this.storeService.setFavorite(this.taco.token_id, !this.taco.isFavorite)
    }
  }

  getRarity() {
    if (this.taco) {
      return this.taco.rarity.replace(/"/g, '')
    }
    return ''
  }

  private updateCardState() {
    this.storeService.accountInfo$.pipe(first()).subscribe((accountInfo) => {
      this.ownAddress = accountInfo?.address
      if (this.taco) {
        this.state = 'free'
        if (this.taco.owner) {
          this.state = 'owned'
        }
        if (isOwner(this.taco, accountInfo)) {
          this.state = 'own'
        }
      }
    })
  }
}
