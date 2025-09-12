import { Injectable } from '@angular/core';
import { Storage, } from '@ionic/storage-angular'
import { Article } from '../interfaces/index';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // private _storage: Storage | null=null;
  // private _localArticles: Article[]=[];

  // constructor ( private storage: Storage){
  //   this.init();
  // }

  // async init(){
  //   const storage = await this.storage.create();
  //   this._storage = storage;

  // }

  // async saveRemoveArticle (article:Article){
  //   this._localArticles = [ article, ...this._localArticles];  
    
  //   this._storage?.set('articles', this._localArticles);
  // }


   private STORAGE_KEY = 'favorite_articles';

  constructor() {}

  async getFavorites(): Promise<Article[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async isFavorite(article: Article): Promise<boolean> {
    const favs = await this.getFavorites();
    return favs.some(a => a.url === article.url);
  }

  async addFavorite(article: Article) {
    const favs = await this.getFavorites();
    if (!favs.some(a => a.url === article.url)) {
      favs.push(article);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favs));
    }
  }

  async removeFavorite(article: Article) {
    let favs = await this.getFavorites();
    favs = favs.filter(a => a.url !== article.url);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favs));
  }

  async toggleFavorite(article: Article) {
    if (await this.isFavorite(article)) {
      await this.removeFavorite(article);
    } else {
      await this.addFavorite(article);
    }
  }
}
