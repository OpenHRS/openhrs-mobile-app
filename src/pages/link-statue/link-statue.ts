import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AppServer} from '../../services/appserver';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'page-statue',
  templateUrl: 'link-statue.html'
})
export class LinkStatuePage {

  private section: any = null;
  private chapterNumber: string = "";
  private sectionNumber: string = "";
  private division: any = null;
  private title: any = null;
  private chapter: any = null;

  constructor(private sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public server: AppServer) {
    this.sectionNumber = this.navParams.get('section');
    this.chapterNumber = this.navParams.get('chapter');
    this.section={name:'',allTexts:[]};
  }

  ionViewDidLoad(){
    console.log("ionViewDidLoad");
    this.findDivisionAndTitle();
    if (this.division!=null && this.title!=null){
        this.loadNewSection();
    }else{
      console.log("division or title is null");
      alert("Chapter or section not found");
    }
  }

  findDivisionAndTitle(){
    for (var a=0;a<this.server.divisionsList.length;a++){
      let div=this.server.divisionsList[a];
      if (div.titles){
        for (var b=0;b<div.titles.length;b++){
          let tle=div.titles[b];
          for (var c=0;c<tle.chapters.length;c++){
            let chp=tle.chapters[c];
            if (chp.sections){
              for (var d=0;d<chp.sections.length;d++){
                let sec=chp.sections[d];
                if (chp.number==this.chapterNumber && sec.number==this.sectionNumber){
                  this.division=div;
                  this.title=tle;
                  this.section=sec;
                  this.chapter=chp;
                  return;
                }
              }
            }
          }
        }
      }
    }
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

  loadChapterSection(chap, sec) {
    let self = this;
    console.log("loadChapterSecton: "+chap+","+sec);
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

  shareStatue(){
    (<any>window).shareText(this.section.url);
  }

  createHyperlinksOfSection() {
    let regEx = /§\d+-\d+(\.\d+)*/;
    this.section.allTexts = [];
    let txt = this.section.text;
    txt = txt.replace(regEx, "<a class='link-statue' chapter-hyper=\"$&\" onclick=\"callFromLink('$&');\">$&</a>");
    txt = txt.replace(/\n/g,"<br />");
    this.section.allTexts.push(txt);
  }

  addToBookmark() {
    this.server.addToBookmark(this.section);
    this.section.bookmarked = true;
  }

  removeFromBookmark() {
    this.server.removeFromBookmark(this.section);
    this.section.bookmarked = false;
  }
}
