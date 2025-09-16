import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces';
import { IonItem, IonLabel, IonButton, IonIcon, IonList, IonContent, IonActionSheet, IonCol, IonCard, IonCardSubtitle, IonRow, IonCardContent, IonCardTitle, IonImg, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { shareOutline, trashOutline } from 'ionicons/icons';
import { StorageService } from 'src/app/services/storage-service';
import { CommonModule } from '@angular/common';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { Share } from '@capacitor/share';

import { addIcons } from 'ionicons'
import { of } from 'rxjs';

addIcons({
  'trash-outline': trashOutline,
  'share-outline': shareOutline
})

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonCol, IonLabel, IonToolbar, IonTitle ,IonHeader, IonButton, IonIcon, IonContent, CommonModule, IonCard, IonCardSubtitle, IonRow, IonCardContent, IonCardTitle, IonImg],
})
export class Tab3Page implements OnInit {

   @Input() article!: Article;
  @Input() index!: number;
  favorites: Article[] = [];

  constructor(private storageService: StorageService,    private iab: InAppBrowser, 
    private platform: Platform,) {}

  async ngOnInit() {
    await this.loadFavorites();
  }

  async ionViewWillEnter() {
    await this.loadFavorites();
  }



  // Refresca la lista de favoritos
  private async loadFavorites() {
    this.favorites = await this.storageService.getFavorites();
  }


  // Toggle favorito con refresh inmediato
async addToFavorites(article: Article) {
  await this.storageService.addFavorite(article);
  this.favorites = await this.storageService.getFavorites(); // refresca lista
}

  // Chequea si un artículo es favorito
  async isFavorite(article: Article): Promise<boolean> {
    return (await this.storageService.getFavorites())
        .some(a => a.url.trim().toLowerCase() === article.url.trim().toLowerCase());
  }

  async removeFavorite(article: Article) {
    await this.storageService.removeFavorite(article);
    await this.loadFavorites();
  }

  openArticle(article: Article){
    if (!article?.url) return; // seguridad extra
    
    if (this.platform.is('ios') || this.platform.is('android')){
      const browser= this.iab.create(article.url);
      browser.show();
      return;
    }
    
    window.open(this.article.url, '_blank');
  }

  async onShareArticle(article: Article){
    if (!article?.url || !article?.title) return; // seguridad extra
    try {
      if (this.platform.is('hybrid')) { // Android / iOS
        await Share.share({
          title: article.title,
          text: 'Mira este artículo interesante',
          url: article.url,
          dialogTitle: 'Compartir con'
        });
      } else { // Web fallback
        if (navigator.share) {
          await navigator.share({
            title: article.title,
            text: 'Mira este artículo interesante',
            url: article.url
          });
        } else {
          alert('Compartir no soportado en este navegador');
        }
      }
    } catch (err) {
      console.error('Error compartiendo:', err);
    }
  }


}
