import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AppServer {

  public divisionsList: any[] = null;

  private BASE_URL = "https://raw.githubusercontent.com/OpenHRS/openhrs-data/master/hrscurrent/";

  // Resolve HTTP using the constructor
  constructor(private http: Http) {
    this.divisionsList=[];
  }

  getLocalJsonTree() {
    let url = this.BASE_URL+"hrscurrent_notext.json";
    return this.http.get(url);
  }

  getLocalJsonTreeByYear(yr) {
    this.BASE_URL = "https://raw.githubusercontent.com/OpenHRS/openhrs-data/master/hrs"+yr+"/";
    let url = this.BASE_URL+"hrs"+yr+"_notext.json";
    console.log(url);
    return this.http.get(url);
  }

  getSectionsForChapter(chapNum) {
    let url = this.BASE_URL + "chapter/" + chapNum + "/section/";
    return this.http.get(url);
  }

  getStatute(id) {
    let url = this.BASE_URL + "id?val=" + id;
    return this.http.get(url);
  }

  getStatuteNew(division,title,chapter,section){
    let url=this.BASE_URL+"division/"+division+"/title/"+title+"/chapter/"+chapter+"/section/"+chapter+"-"+section+".json";
    console.log(url);
    return this.http.get(url);
  }

  getSection(chapNum, secNum): any {
    let url = this.BASE_URL + "chapter/" + chapNum + "/section/" + secNum;
    return this.http.get(url);
  }

  getSearchQuery(query, length) {
    let url="http://dev.hrs.diblii.com/api/statutes/search?input=" + encodeURI(query) + "&size=" + length;
    console.log(url);
    return this.http.get(url);
  }

  isInBookmark(sect) {
    let js = (<any>window).localStorage.hrsSectionBookmark;
    if (!js) {
      js = [];
    } else {
      js = JSON.parse(js);
    }
    for (var a = 0; a < js.length; a++) {
      if (js[a].section == sect.section && js[a].chapter == sect.chapter) {
        return true;
      }
    }
    return false;
  }

  addToBookmark(sect) {
    let js = (<any>window).localStorage.hrsSectionBookmark;
    if (!js) {
      js = [];
    } else {
      js = JSON.parse(js);
    }
    js.push(sect);
    (<any>window).localStorage.hrsSectionBookmark = JSON.stringify(js);
  }

  removeFromBookmark(sect) {
    let js = (<any>window).localStorage.hrsSectionBookmark;
    if (!js) {
      js = [];
    } else {
      js = JSON.parse(js);
    }
    for (var a = 0; a < js.length; a++) {
      if (js[a].section == sect.section && js[a].chapter == sect.chapter) {
        js.splice(a, 1);
      }
    }
    (<any>window).localStorage.hrsSectionBookmark = JSON.stringify(js);
  }

  getAllBookmarks() {
    let js = (<any>window).localStorage.hrsSectionBookmark;
    if (!js) {
      js = [];
    } else {
      js = JSON.parse(js);
    }
    return js;
  }
}
