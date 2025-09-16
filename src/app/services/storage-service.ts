import { Injectable } from '@angular/core';
import { Storage, } from '@ionic/storage-angular'
import { Article } from '../interfaces/index';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private STORAGE_KEY = 'favorite_articles';

  constructor() {}
  
  private normalizeUrl(url: string): string {
    return url.trim().toLowerCase();
  }

  async getFavorites(): Promise<Article[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async isFavorite(article: Article): Promise<boolean> {
    const favs = await this.getFavorites();
    return favs.some(a => this.normalizeUrl(a.url) === this.normalizeUrl(article.url));
  }

  async addFavorite(article: Article): Promise<void>{
    const favs = await this.getFavorites();
    const exists = favs.some(a => this.normalizeUrl(a.url) === this.normalizeUrl(article.url));

    if (!exists) {
      favs.push(article);            
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favs));
    }
    // si ya existe, no tocar nada
  }

  async removeFavorite(article: Article): Promise<void> {
    const favs = await this.getFavorites();

    const filtered = favs.filter(a => this.normalizeUrl(a.url) !== this.normalizeUrl(article.url));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  async toggleFavorite(article: Article): Promise<void> {
    if (await this.isFavorite(article)) {
      await this.removeFavorite(article);
    } else {
      await this.addFavorite(article);
    }
  }
}
