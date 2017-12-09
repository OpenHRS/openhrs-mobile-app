import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AppServer} from '../../services/appserver';
import {DomSanitizer} from '@angular/platform-browser';
import {LinkStatuePage} from '../link-statue/link-statue';


@Component({
  selector: 'page-statue',
  templateUrl: 'statue.html'
})
export class StatuePage {

  private section: any = null;
  private division: any = null;
  private chapter: any = null;
  private title: any = null;
  private bookmarked: boolean = false;
  private sectionsList: any[] = null;
  private currentSecIndex: number = 0;
  private isFromSearch: boolean = false;
  private isFromBookmark: boolean = false;

  constructor(private sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public server: AppServer) {
    this.section = this.navParams.get('section');
    this.division = this.navParams.get('division');
    this.chapter = this.navParams.get('chapter');
    this.title = this.navParams.get('title');
    
    this.section.allTexts = [];
    if (this.navParams.get('sectionsList')) {
      this.sectionsList = this.navParams.get('sectionsList');
      this.currentSecIndex = this.navParams.get('sectionIndex');
    }
    if (this.navParams.get('isFromSearch')) {
      this.isFromSearch = true;
    }

    if (this.navParams.get('isFromBookmark')) {
      this.isFromBookmark = true;
      this.division={number: this.section.division};
      this.chapter={number: this.section.chapter};
      this.title={number: this.section.title};
    }

    this.bookmarked = this.server.isInBookmark(this.section);
    if (this.isFromSearch) {
      this.loadSection(this.section._id);
    } else {
      this.loadNewSection();
    }

    (<any>window).statueRef = this;
  }

  goBack() {
    this.navCtrl.pop();
  }

  loadNewSection(){
    let self = this;
    (self.server).getStatuteNew(this.division.number,this.title.number,this.chapter.number,this.section.number).subscribe(result => {
      let jsonRes = result.json();
      self.section = jsonRes;//jsonRes[0];
      self.section.allTexts = [];
      self.section.division=self.division.number;
      self.section.title=self.title.number;
      self.section.chapter=self.chapter.number;
      self.section.section=self.section.number;
      self.section.section_text="";
      self.section.bookmarked = self.server.isInBookmark(self.section);
      self.createHyperlinksOfSection();
    });
  }

  loadSection(id) {
    let self = this;
    (self.server).getStatute(id).subscribe(result => {
      let jsonRes = result.json();
      self.section = jsonRes[0];
      self.section.bookmarked = self.server.isInBookmark(self.section);
      self.section.allTexts = [];
      self.createHyperlinksOfSection();
    });
  }

  loadChapterSection(chap, sec) {
    let self = this;
    self.navCtrl.push(LinkStatuePage, {chapter: chap,section: sec});
  }

  shoutMe(chp) {
    let vals = chp.split("-");
    if (vals.length > 1) {
      let chap = vals[0].substring(1);
      let sec = vals[1];
      this.loadChapterSection(chap, sec);
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustHtml(url);
  }

  createHyperlinksOfSection() {
    let regEx = /§\d+-\d+(\.\d+)*/;
    this.section.allTexts = [];
    let txt = this.section.text;
    txt = txt.replace(regEx, "<a class='link-statue' chapter-hyper=\"$&\" onclick=\"callFromLink('$&');\">$&</a>");
    txt = txt.replace(/\n/g,"<br />");
    this.section.allTexts.push(txt);
  }

  shareStatue(){
    (<any>window).shareText(this.section.url);
  }

  addToBookmark() {
    this.server.addToBookmark(this.section);
    this.bookmarked = true;
    this.section.bookmarked = this.bookmarked;
  }

  removeFromBookmark() {
    this.server.removeFromBookmark(this.section);
    this.bookmarked = false;
    this.section.bookmarked = this.bookmarked;
  }

  moveNext() {
    if (this.sectionsList != null) {
      if (this.currentSecIndex < (this.sectionsList.length - 1)) {
        this.currentSecIndex++;
        if (this.isFromSearch) {
          this.loadSection(this.sectionsList[this.currentSecIndex]._id);
        } else {
          this.section = this.sectionsList[this.currentSecIndex];
          this.loadNewSection();
        }
      }
    }
  }

  movePrev() {
    if (this.sectionsList != null) {
      if (this.currentSecIndex > 0) {
        this.currentSecIndex--;
        if (this.isFromSearch) {
          this.loadSection(this.sectionsList[this.currentSecIndex]._id);
        } else {
          this.section = this.sectionsList[this.currentSecIndex];
          this.loadNewSection();
        }
      }
    }
  }

}
