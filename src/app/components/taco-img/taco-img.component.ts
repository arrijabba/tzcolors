import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'taco-img',
  templateUrl: './taco-reg-p.svg',
})
export class TacoImgComponent implements OnInit {
  @Input() dna_data: any

  color1 = '#000000'
  color2 = '#000000'
  color3 = '#363636'
  color4 = '#000000'
  color5 = '#ffffff'

  constructor() {}

  ngOnInit() {
    console.log(this.dna_data)

    var d = this.dna_data

    if (d['color1']) {
      this.color1 = d['color1']
    }
    if (d['color2']) {
      this.color2 = d['color2']
    }
    if (d['color3']) {
      this.color3 = d['color3']
    }
    if (d['color4']) {
      this.color4 = d['color4']
    }
    if (d['color5']) {
      this.color5 = d['color5']
    }
  }
}
