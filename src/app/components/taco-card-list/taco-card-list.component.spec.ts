import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TacoCardListComponent } from './taco-card-list.component'

describe('TacoCardListComponent', () => {
  let component: TacoCardListComponent
  let fixture: ComponentFixture<TacoCardListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TacoCardListComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TacoCardListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
