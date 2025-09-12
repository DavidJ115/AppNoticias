import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { Article, ArticleByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable, of } from 'rxjs';
import {  map } from "rxjs/operators";
import { storedArticlesByCategory } from '../data/mock-news';



const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class News {

  //Quitar el storedArticlesByCategory y colocar {} para usar la API
  private articlesByCategoryAndPage: ArticleByCategoryAndPage = storedArticlesByCategory;

  constructor(private http:HttpClient){}

  private executeQuery<T>(endpoint:string){
    console.log('Peticion HTTP realizada al endpoint: ', endpoint);
    return this.http.get<T>(`https://newsapi.org/v2/${endpoint}`,{
      params:{
        apiKey: apiKey,
        country: 'us'
      }
    });
  }

  getTopHeadLines():Observable<Article[]>{

    return this.getTopHeadLinesByCategory('business');

    // return this.executeQuery<NewsResponse>(`/top-headlines?country=us&category=business`).pipe(
    //   map(({articles}) => articles)
    // );
  }

  getTopHeadLinesByCategory(category:string, loadMore:boolean=false):Observable<Article[]>{
    
    //Linea para cargar data local, la funcion if no carga ya que está todo local.
    return of(this.articlesByCategoryAndPage[category].articles);

    if(loadMore){
      this.getArticlesByCategory(category);
    }

    if( this.articlesByCategoryAndPage[category]){
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (Object.keys(this.articlesByCategoryAndPage).includes(category)) {
      //this.articlesByCategoryAndPage[category].page += 1;
    }else{
      this.articlesByCategoryAndPage[category] = {  page: 0, articles: []};
    }

    
    const page= this.articlesByCategoryAndPage[category].page+1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`).pipe(
      map(({articles}) => {
        if (articles.length === 0) return this.articlesByCategoryAndPage[category].articles;
        this.articlesByCategoryAndPage[category] ={ 
          page: page, 
          articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]};

        return this.articlesByCategoryAndPage[category].articles;
      })
    );
  }
}
