import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailvisitingPage } from './detailvisiting';
import { PipesModule } from '../../pipes/pipes.module';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    DetailvisitingPage
  ],
  imports: [
    IonicPageModule.forChild(DetailvisitingPage),
    IonicImageViewerModule,
    PipesModule
  ],
})
export class DetailvisitingPageModule {}
