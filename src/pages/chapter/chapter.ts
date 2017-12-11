import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { SectionPage } from '../section/section';

@Component({
  selector: 'page-chapter',
  templateUrl: 'chapter.html'
})
export class ChapterPage {

  private division: any = null;
  private title: any = null;
  private divisionsList: any[] = null;
  private currentSecIndex: number = 0;

  constructor(public navCtrl: NavController,private navParams: NavParams) {
    this.division=this.navParams.get('division');
    this.title=this.navParams.get('title');

    this.divisionsList=this.navParams.get('divisionsList');
    this.currentSecIndex=this.navParams.get('sectionIndex');
  }

  goBack(){
    this.navCtrl.pop();
  }
  
  openChapter(chp,idx){
    this.navCtrl.push(SectionPage, {
      chapter: chp,
    });
  }

  moveNext() {
    if (this.divisionsList != null) {
      if (this.currentSecIndex < (this.divisionsList.length - 1)) {
        this.currentSecIndex++;
        this.title = this.divisionsList[this.currentSecIndex];
      }
    }
  }

  movePrev() {
    if (this.divisionsList != null) {
      if (this.currentSecIndex > 0) {
        this.currentSecIndex--;
        this.title = this.divisionsList[this.currentSecIndex];
      }
    }
  }
}
