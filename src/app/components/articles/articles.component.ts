import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonRow, IonGrid, IonCardContent, IonCard, IonCol, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/angular/standalone';
import { Article } from 'src/app/interfaces';
import { ArticleComponent } from "../article/article.component";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  standalone: true,
  imports: [IonRow, IonGrid, IonCol, CommonModule, ArticleComponent]
})
export class ArticlesComponent  implements OnInit {

  @Input() articles: Article [] = [];

  constructor() { }

  ngOnInit() {}

}
