import {Component} from '@angular/core';
import {DivisionPage} from '../division/division';
import {TitlePage} from '../title/title';
import {ChapterPage} from '../chapter/chapter';
import {SectionPage} from '../section/section';
import {StatuePage} from '../statue/statue';
import {LinkStatuePage} from '../link-statue/link-statue';
import {SearchPage} from '../search/search';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {cloudVisionService} from '../../services/cloudVisionService'
import {AppServer} from '../../services/appserver'
import { Response } from '@angular/http';

import {
  NavController, 
  LoadingController, 
  AlertController
  } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [[Camera]]
})

export class HomePage {

  public searchQuery: string;
  splash = true;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private camera: Camera,
              private vision: cloudVisionService,
              private server: AppServer) {
  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 3000);
    this.loadLocalJson();
  }

  addMealSuccess(res: Response){
    try{
      let jsonRes=res.json();
      this.server.divisionsList=[];
      for (var a=0;a<jsonRes.length;a++){
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
    this.server.getLocalJsonTreeByYear("current").subscribe(
      res=>that.addMealSuccess(res),err=>that.addMealFailure(err)
    );
  }

  goToDivision(params) {
    if (!params) params = {};
    this.navCtrl.push(DivisionPage);
  }

  goToTitle(params) {
    if (!params) params = {};
    this.navCtrl.push(TitlePage);
  }

  goToChapter(params) {
    if (!params) params = {};
    this.navCtrl.push(ChapterPage);
  }

  goToSection(params) {
    if (!params) params = {};
    this.navCtrl.push(SectionPage);
  }

  goToStatue(params) {
    if (!params) params = {};
    this.navCtrl.push(StatuePage);
  }

  goToSearch(params) {
    if (!params) params = {};
    this.navCtrl.push(SearchPage, {
      query: this.searchQuery
    });
    this.searchQuery = "";
  }

  goToCamera(): void {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.processImage(imageData);
    }, (err) => {
      console.log("Error trying to open camera.")
    });
  }

  processImage(imageData): void {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Processing image...',
    });

    let alert = this.alertCtrl.create({
      title: 'Error Processing Image.',
      message: 'Could not process image. Try taking a clearer picture.',
      buttons: ['Dismiss']
    });

    loading.present().then(() => {
      this.vision.getText(imageData).subscribe((result) => {
        var textAnnotations = result.json().responses[0].fullTextAnnotation;

        if (textAnnotations == undefined) {
          loading.dismiss();
          alert.present()
          
        } else {
          this.parseText(textAnnotations.text);
          loading.dismiss();
        }

      }, err => {
        loading.dismiss()
        alert.present()
      });
    });
  }

  parseText(text): void {
    let alert = this.alertCtrl.create({
      title: 'Error Processing Image.',
      message: 'Could not process image. Try taking a clearer picture.',
      buttons: ['Dismiss']
    });
    let matchedText = text.match(/(\d+(\-\d+))/g);
    let section = "";

    if (matchedText != null) {
      let chapterSection = matchedText[0].split('-');

      this.navCtrl.push(LinkStatuePage,{chapter:chapterSection[0],section:chapterSection[1]});
    } else {
      // No statute was found in the text
      alert.present()
    }
  }


}
