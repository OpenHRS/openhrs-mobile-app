import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ChapterPage } from '../chapter/chapter';

@Component({
  selector: 'page-title',
  templateUrl: 'title.html'
})
export class TitlePage {

  private division: any = null;
  private divisionsList: any[] = null;
  private currentSecIndex: number = 0;

  constructor(public navCtrl: NavController,private navParams: NavParams) {
    this.division=this.navParams.get('division');
    this.divisionsList=this.navParams.get('divisionsList');
    this.currentSecIndex=this.navParams.get('sectionIndex');
  }

  goBack(){
    this.navCtrl.pop();
  }
  openTitle(tle,idx){
    this.navCtrl.push(ChapterPage,{division: this.division,divisionsList: this.division.titles,sectionIndex: idx,title: tle});
  }

  moveNext() {
    if (this.divisionsList != null) {
      if (this.currentSecIndex < (this.divisionsList.length - 1)) {
        this.currentSecIndex++;
        this.division = this.divisionsList[this.currentSecIndex];
      }
    }
  }

  movePrev() {
    if (this.divisionsList != null) {
      if (this.currentSecIndex > 0) {
        this.currentSecIndex--;
        this.division = this.divisionsList[this.currentSecIndex];
      }
    }
  }
}
