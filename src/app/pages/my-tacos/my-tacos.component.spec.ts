import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MyTacosComponent } from './my-tacos.component'

describe('MyTacosComponent', () => {
  let component: MyTacosComponent
  let fixture: ComponentFixture<MyTacosComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyTacosComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTacosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
