import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonCol, IonRow, IonGrid, IonCard, IonCardSubtitle, IonCardTitle, IonImg, IonCardContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';


import { News } from 'src/app/services/news';
import { Article } from '../../interfaces/index';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components-module';
import { ArticleComponent } from "src/app/components/article/article.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, ComponentsModule, IonInfiniteScroll, IonInfiniteScrollContent],
})
export class Tab1Page implements OnInit{

  @ViewChild(IonInfiniteScroll, {static: true} ) infiniteScroll: IonInfiniteScroll;

  public articles: Article[] = [];

  constructor(private newsService: News) {}

  ngOnInit(){
    this.newsService.getTopHeadLines()
      .subscribe ( articles => this.articles.push( ...articles));
  }

  loadData() {
    this.newsService.getTopHeadLinesByCategory('business', true).subscribe(articles =>{
      
      if (articles.length === this.articles.length){
        this.infiniteScroll!.disabled=true;

        //event.target.disabled = true;
        return;
      }

      this.articles = articles;
      this.infiniteScroll.complete();
      //event.target.complete();
      
    });
  }
}