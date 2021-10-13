import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash'

@Component({
  selector: 'app-tour-language-offered',
  templateUrl: './tour-language-offered.component.html',
  styleUrls: ['./tour-language-offered.component.scss']
})
export class TourLanguageOfferedComponent implements OnInit {
  @Input() tour: any;
  @Input() type = 'simple';
  @Input() sizeIcon = 25;
  @Input() centerText = false;

  public currentLanguage: any
  private route = '../../../../assets/extra/flag'
  public languages = [
    {
      key: "EN",
      icon: `${this.route}-EN.png`,
      text: 'GENERAL.IN_EN'
    },
    {
      key: "ES",
      icon: `${this.route}-ES.png`,
      text: 'GENERAL.IN_ES'
    }
  ]

  ngOnInit(): void {
    const { lenguages } = this.tour
    const firstLanguage = _.head(lenguages)
    this.currentLanguage = _.find(this.languages, i => i.key === firstLanguage)
    if (!this.currentLanguage) {
      this.currentLanguage = _.last(this.languages)
    }
  }
}
