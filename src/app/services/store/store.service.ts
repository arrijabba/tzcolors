import { Injectable } from '@angular/core'
import {
  BehaviorSubject,
  combineLatest,
  interval,
  Observable,
  ReplaySubject,
} from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { State } from 'src/app/app.reducer'
import { environment } from 'src/environments/environment'
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
} from 'rxjs/operators'
import { AccountInfo } from '@airgap/beacon-sdk'
var deepEqual = require('fast-deep-equal/es6')

const tacosFromStorage: Taco[] = []

export interface Taco {
  id: string
  name: string
  rarity: TacoCategory
  category: string
  color1: string | undefined
  color2: string | undefined
  color3: string | undefined
  color4: string | undefined
  color5: string | undefined
  symbol: string
  token_id: number
  owner: string | undefined
  loading: boolean
  isFavorite: boolean
}

export interface Child {
  prim: string
  type: string
  name: string
  value: string
  children: Child[] | undefined
}

export interface Key {
  prim: string
  type: string
  value: string
}

export interface Value {
  prim: string
  type: string
  value: string
  children: Child[] | undefined
}

export interface Data {
  key: Key
  value: Value
  key_hash: string
  key_string: string
  level: number
  timestamp: Date
}

export interface RootObject {
  data: Data
  count: number
}

export type ViewTypes = 'explore' | 'my-tacos' | 'watchlist'

export type TacoCategory = 'all' | 'Secret' | 'Hidden' | 'Rare' | 'Normal'

export type SortTypes = 'ID' | 'rarity'

export type SortDirection = 'asc' | 'desc'

const STORAGE_KEY_FAVORITES = 'tzTaco:favorites'

export const isOwner = (taco: Taco, accountInfo?: AccountInfo) => {
  return taco.owner && taco.owner === accountInfo?.address
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  public tacos$: Observable<Taco[]>
  public tacosCount$: Observable<number>
  public accountInfo$: Observable<AccountInfo | undefined>

  public sortType$: Observable<SortTypes>
  public sortDirection$: Observable<SortDirection>
  public category$: Observable<TacoCategory>
  public view$: Observable<ViewTypes>

  public loading$: Observable<boolean>
  public favorites$: Observable<number[]>

  private _tacos$: ReplaySubject<Taco[]> = new ReplaySubject(1)

  private _favorites: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
    []
  )

  private _numberOfItems: BehaviorSubject<number> = new BehaviorSubject(12)
  private _searchTerm: BehaviorSubject<string> = new BehaviorSubject('')
  private _sortType: BehaviorSubject<SortTypes> = new BehaviorSubject<SortTypes>(
    'ID'
  )
  private _sortDirection: BehaviorSubject<SortDirection> = new BehaviorSubject<SortDirection>(
    'desc'
  )
  private _category: BehaviorSubject<TacoCategory> = new BehaviorSubject<TacoCategory>(
    'all'
  )
  private _view: BehaviorSubject<ViewTypes> = new BehaviorSubject<ViewTypes>(
    'explore'
  )

  private _ownerInfo: BehaviorSubject<
    Map<number, string>
  > = new BehaviorSubject(new Map())
  private _metaInfo: BehaviorSubject<Map<number, any>> = new BehaviorSubject(
    new Map()
  )
  private _tacoStates: BehaviorSubject<
    Map<number, boolean>
  > = new BehaviorSubject(new Map())

  private _accountInfo: BehaviorSubject<
    AccountInfo | undefined
  > = new BehaviorSubject<AccountInfo | undefined>(undefined)

  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  )

  constructor(
    private readonly http: HttpClient,
    private readonly store$: Store<State>
  ) {
    this.store$
      .select(
        (state) => (state as any).app.connectedWallet as AccountInfo | undefined
      )
      .subscribe((accountInfo) => {
        this._accountInfo.next(accountInfo)
      }) // TODO: Refactor?

    this.accountInfo$ = this._accountInfo.asObservable()
    this.sortType$ = this._sortType.asObservable()
    this.sortDirection$ = this._sortDirection.asObservable()
    this.category$ = this._category.asObservable()
    this.view$ = this._view.asObservable()
    this.loading$ = this._loading.asObservable()
    this.favorites$ = this._favorites.asObservable()

    this.initFromStorage()

    let internalTacos$ = combineLatest([
      this._tacos$.pipe(
        // distinctUntilChanged(),
        tap((x) => console.log('tacos changed', x))
      ),
      this._category.pipe(
        distinctUntilChanged(),
        tap((x) => console.log('category changed', x))
      ),
      this._view.pipe(
        distinctUntilChanged(),
        tap((x) => console.log('view changed', x))
      ),
      this._ownerInfo.pipe(
        // distinctUntilChanged(),
        tap((x) => console.log('ownerInfo changed', x))
      ),
      this._tacoStates.pipe(
        // distinctUntilChanged(),
        tap((x) => console.log('tacoStates changed', x))
      ),
      this._favorites.pipe(
        // distinctUntilChanged(),
        tap((x) => console.log('favorites changed', x))
      ),
      this._accountInfo.pipe(
        distinctUntilChanged(),
        tap((x) => console.log('accountInfo changed', x))
      ),
      this._searchTerm.pipe(
        distinctUntilChanged(),
        tap((x) => console.log('_searchTerm changed', x))
      ),
      this._sortType.pipe(
        distinctUntilChanged(),
        tap((x) => console.log('_sortType changed', x))
      ),
      this._sortDirection.pipe(
        distinctUntilChanged(),
        tap((x) => console.log('_sortDirection changed', x))
      ),
    ]).pipe(
      map((x) => x as any), // TODO: Fix typing?
      tap(() => {
        this._loading.next(true)
      }),
      debounceTime(10),
      map(
        ([
          tacos,
          category,
          view,
          ownerInfo,
          tacoStates,
          favorites,
          accountInfo,
          searchTerm,
          sortType,
          sortDirection,
        ]: [
          Taco[],
          TacoCategory,
          ViewTypes,
          Map<number, string>,
          Map<number, boolean>,
          number[],
          AccountInfo | undefined,
          string,
          SortTypes,
          SortDirection
        ]) =>
          tacos
            .map((c) => ({
              ...c,
              owner: ownerInfo.get(Number(c.token_id)),
              loading: tacoStates.get(c.token_id) ?? false,
              isFavorite: favorites.includes(c.token_id), // TODO: use map
            }))
            .filter((c) =>
              view === 'explore'
                ? true
                : view === 'watchlist'
                ? c.isFavorite
                : view === 'my-tacos'
                ? isOwner(c, accountInfo)
                : true
            )
            .filter(
              (c) =>
                category === 'all' || c.rarity.replace(/"/g, '') === category
            )
            .filter(
              (c) =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.owner?.toLowerCase() === searchTerm.toLowerCase()
            )
            .sort((a_, b_) => {
              const { a, b } =
                sortDirection === 'asc' ? { a: a_, b: b_ } : { a: b_, b: a_ }

              if (sortType === 'rarity') {
                // TODO: Improve sorting code
                const rarities = {
                  Normal: 0,
                  Rare: 1,
                  Hidden: 2,
                  Secret: 3,
                }

                return (
                  rarities[a.rarity.replace(/"/g, '')] -
                  rarities[b.rarity.replace(/"/g, '')]
                )
              }

              return Number(a.id) - Number(b.id)
            })
      ),
      shareReplay(1)
    )

    this.tacosCount$ = internalTacos$.pipe(
      map((tacos) => tacos.length),
      shareReplay(1)
    )
    this.tacos$ = combineLatest([internalTacos$, this._numberOfItems]).pipe(
      map(([tacos, numberOfItems]) => tacos.slice(0, numberOfItems)),
      tap(() => this._loading.next(false)),
      shareReplay(1)
    )

    this.getTacoOwners()
    this.getTacoMeta()
    this.updateState()
  }

  initFromStorage() {
    try {
      const storedFavorites: string =
        localStorage.getItem(STORAGE_KEY_FAVORITES) ?? '[]'
      const favorites: number[] = JSON.parse(storedFavorites)
      this._favorites.next(favorites)
    } catch (e) {}
  }

  setView(view: ViewTypes) {
    this._view.next(view)
  }
  resetFilters() {
    this._category.next('all')
    this._searchTerm.next('')
    this._numberOfItems.next(12)
  }
  setCategory(category: TacoCategory) {
    this._category.next(category)
  }
  setFilter() {}
  setSortType(type: SortTypes) {
    this._sortType.next(type)
  }
  setSortDirection(direction: SortDirection) {
    this._sortDirection.next(direction)
  }
  setSearchString(searchTerm: string) {
    this._searchTerm.next(searchTerm)
  }

  setNumberOfItems(numberOfItems: number) {
    this._numberOfItems.next(numberOfItems)
  }
  setTacoLoadingState(tokenId: number, loading: boolean) {
    const map = this._tacoStates.value
    map.set(tokenId, loading)
    this._tacoStates.next(map)
  }
  resetTacoLoadingStates() {
    this._tacoStates.next(new Map())
  }

  setFavorite(token_id: number, isFavorite: boolean) {
    let favorites = this._favorites.value
    if (isFavorite && !favorites.includes(token_id)) {
      favorites.push(token_id)
    } else if (!isFavorite) {
      favorites = favorites.filter((favorite) => favorite !== token_id)
    }
    this._favorites.next(favorites)
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites))
  }

  async getTacoOwners() {
    const data = await this.http
      .get<RootObject[]>(`${environment.tacosBigmapOwnerUrl}`)
      .toPromise()

    const ownerInfo = new Map<number, string>()

    data
      .filter((d) => d.data.value.value !== null)
      .forEach((d) => {
        ownerInfo.set(Number(d.data.key.value), d.data.value.value)
      })

    if (!deepEqual(this._ownerInfo.value, ownerInfo)) {
      console.log('Owners: Not equal, updating')
      this._ownerInfo.next(ownerInfo)
      this._tacoStates.next(new Map())
    } else {
      console.log('Owners: responses are equal')
    }
  }

  async getTacoMeta() {
    const data = await this.http
      .get<RootObject[]>(`${environment.tacosBigmapMetaUrl}`)
      .toPromise()

    var metaInfo: Taco[] = []

    data
      .filter((d) => d.data.value !== null)
      .forEach((d) => {
        var ret: Taco = {
          id: d.data.key.value,
          name: '',
          rarity: 'Normal',
          category: '',
          color1: '#000000',
          color2: '#000000',
          color3: '#363636',
          color4: '#000000',
          color5: '#ffffff',
          symbol: '',
          token_id: 0,
          owner: '',
          loading: false,
          isFavorite: false,
        }

        if (d.data.value.children && d.data.value.children.length > 0) {
          d.data.value.children.map((r) => {
            if (r['name'] == 'token_info' && r.children) {
              r.children.map((row) => {
                if (row['name'].startsWith('color')) {
                  var color = row['value']

                  if (color.length == 6) {
                    ret[row['name']] = '#' + row['value']
                  } else if (color.length == 3) {
                    var arr = this.toUTF8Array(color)
                    ret[row['name']] =
                      '#' +
                      arr[0].toString(16) +
                      arr[1].toString(16) +
                      arr[2].toString(16)
                  } else {
                    ret[row['name']] = '#ffffff'
                  }
                } else if (!ret[row['name']]) {
                  ret[row['name']] = row['value']
                } else {
                  ret[row['name']] = row['value']
                }
              })
            }
          })

          if (ret.name) {
            ret.name = ret.name.replace(/"/g, '') + ' ' + ret.id
          }

          if (this._ownerInfo) {
            ret.owner = this._ownerInfo[Number(ret.id)]
          }

          metaInfo.push(ret)
        }
      })

    console.log(metaInfo)

    if (!deepEqual(this._metaInfo.value, metaInfo)) {
      console.log('Meta: Not equal, updating')
      this._tacos$.next(metaInfo)
      this._tacoStates.next(new Map())
    } else {
      console.log('Meta: responses are equal')
    }
  }

  updateState() {
    let subscription = interval(1020_000).subscribe((x) => {
      console.log('refrezh')
      this.getTacoOwners()
      this.getTacoMeta()
    })
  }

  private toUTF8Array(str) {
    let utf8: any[] = []
    for (let i = 0; i < str.length; i++) {
      let charcode = str.charCodeAt(i)
      if (charcode < 0x80) utf8.push(charcode)
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(
          0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        )
      }
      // surrogate pair
      else {
        i++
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charcode =
          0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
        utf8.push(
          0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        )
      }
    }
    return utf8
  }

  private getDate(value: string): Date {
    const year = value.substring(0, 4).padStart(2, '0')
    const month = value.substring(5, 7).padStart(2, '0')
    const day = value.substring(8, 10).padStart(2, '0')
    const hour = value.substring(11, 13).padStart(2, '0')
    const minute = value.substring(14, 16).padStart(2, '0')
    const second = value.substring(17, 19).padStart(2, '0')

    const date = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`
    )

    if (!isNaN(date.getTime())) {
      return date
    }
    throw new Error('CANNOT PARSE DATE')
  }
}
