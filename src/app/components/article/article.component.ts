import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { IonCardSubtitle, IonCardTitle, IonImg, IonCard, IonCardContent, IonCol, IonRow, IonButton, IonIcon, IonActionSheet } from '@ionic/angular/standalone';
import { Article } from 'src/app/interfaces';
import { Platform } from '@ionic/angular';

import {addIcons} from 'ionicons'
import { closeOutline, ellipsisVerticalOutline, heartOutline, shareOutline } from 'ionicons/icons';

//Plugin para enlaces web
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Share } from '@capacitor/share';
import { StorageService } from '../../services/storage-service';



addIcons({
  'ellipsis-vertical-outline': ellipsisVerticalOutline,
  'share-outline': shareOutline,
  'heart-outline': heartOutline,
  'close-outline': closeOutline
})

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonCol, IonCardContent, IonCardSubtitle, IonCardTitle, IonImg, IonCard, CommonModule, IonRow, IonActionSheet],
  providers: []
})
export class ArticleComponent  {

  @Input() article!: Article;
  @Input() index!: number;

  @ViewChild('actionSheet') actionSheet!: IonActionSheet;

  
  actionSheetOpen = false;

  public actionSheetButtons = [
    {
      text: 'Compartir',
      icon: 'share-outline',
      handler:() => this.onShareArticle()
    },
    {
      text: 'Favorito',
      icon: 'heart-outline',
      handler:() => this.onToggleFavorite()
    },
    {
      text: 'Cancelar',
      icon: 'close-outline',
      role: 'cancel',
      cssClass: 'secondary'
    },
  ];

  constructor(
    private iab: InAppBrowser, 
    private platform: Platform,
    private storageService: StorageService
  ) { }

  
  ngOnInit() {}

  openArticle(){

    if (this.platform.is('ios') || this.platform.is('android')){
      const browser= this.iab.create(this.article.url);
      browser.show();
      return;
    }
    
    window.open(this.article.url, '_blank');
  }


  async onShareArticle(){
     this.actionSheetOpen = false; // cerrar el ActionSheet

    try {
      if (this.platform.is('hybrid')) { // Android / iOS
        await Share.share({
          title: this.article.title,
          text: 'Mira este artículo interesante',
          url: this.article.url,
          dialogTitle: 'Compartir con'
        });
      } else { // Web fallback
        if (navigator.share) {
          await navigator.share({
            title: this.article.title,
            text: 'Mira este artículo interesante',
            url: this.article.url
          });
        } else {
          alert('Compartir no soportado en este navegador');
        }
      }
    } catch (err) {
      console.error('Error compartiendo:', err);
    }
  }

  async onToggleFavorite(){
   //this.storageService.saveRemoveArticle(this.article);
    await this.storageService.addFavorite(this.article);
    this.actionSheetOpen = false;
  }

    async isFavorite(): Promise<boolean> {
    return this.storageService.isFavorite(this.article);
  }
}
