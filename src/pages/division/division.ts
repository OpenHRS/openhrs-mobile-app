import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { TitlePage } from '../title/title';
import { AppServer } from '../../services/appserver';
import { Response } from '@angular/http';

@Component({
  selector: 'page-division',
  templateUrl: 'division.html'
})
export class DivisionPage {

  private divisions: any[] = null;
  private currentYear: string = "current";
  private years: any[] = null;

  constructor(public navParams: NavParams,public navCtrl: NavController,public server: AppServer) {
    this.divisions=[];
    this.years=[];
    this.years.push({year: "current",yearTitle:"Current Year"});
    for (var a=2016;a>=2002;a--){
      this.years.push({year: ""+a,yearTitle:"Year "+a});
    }

    this.loadLocalJson();
  }

  onYearChanged(){
    this.loadLocalJson();
  }

  goBack(){
    this.navCtrl.pop();
  }
  
  openDivision(div,idx){
    this.navCtrl.push(TitlePage,{division: div,divisionsList: this.divisions,sectionIndex: idx});
  }

  addMealSuccess(res: Response){
    try{
      let jsonRes=res.json();
      this.divisions=[];
      this.server.divisionsList=[];
      for (var a=0;a<jsonRes.length;a++){
        this.divisions.push(jsonRes[a]);
        this.server.divisionsList.push(jsonRes[a]);
      }
    }catch(e){
      alert("Exception: "+e.message);
    }
  }

  addMealFailure(error: any){
    alert('Error: '+JSON.stringify(error));
  }

  loadLocalJson(){
    let that=this;
    this.server.getLocalJsonTreeByYear(this.currentYear).subscribe(
      res=>that.addMealSuccess(res),err=>that.addMealFailure(err)
    );
  }
}
