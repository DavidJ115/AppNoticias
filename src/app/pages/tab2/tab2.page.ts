import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { Article } from 'src/app/interfaces';
import { News } from 'src/app/services/news';
import { ArticleComponent } from "src/app/components/article/article.component";
import { ComponentsModule } from '../../components/components-module';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, CommonModule, ComponentsModule, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class Tab2Page implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: true} ) infiniteScroll: IonInfiniteScroll | undefined;

  public categories: string[] = ['business','entertainment','general','health','science','sports','technology'];
  public selectedCategory: string = this.categories[0];
  public articles: Article[] = [];

  constructor(private newsService: News) {}

  ngOnInit() {
    this.newsService.getTopHeadLinesByCategory(this.selectedCategory).subscribe(articles => {
      this.articles = [...articles];
    });
  }

  segmentChanged(event: any){
    this.selectedCategory = event.detail.value;
    this.newsService.getTopHeadLinesByCategory(this.selectedCategory).subscribe(articles => {
      this.articles = [...articles ];
    });
  }

  loadData() {
    this.newsService.getTopHeadLinesByCategory(this.selectedCategory, true).subscribe(articles =>{
      
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
