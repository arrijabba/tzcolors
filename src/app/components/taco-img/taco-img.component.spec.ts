import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TacoImgComponent } from './taco-img.component'

describe('TacoImgComponent', () => {
  let component: TacoImgComponent
  let fixture: ComponentFixture<TacoImgComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TacoImgComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TacoImgComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
