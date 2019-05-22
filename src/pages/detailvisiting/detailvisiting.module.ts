import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailvisitingPage } from './detailvisiting';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DetailvisitingPage
  ],
  imports: [
    IonicPageModule.forChild(DetailvisitingPage),
    PipesModule
  ],
})
export class DetailvisitingPageModule {}
