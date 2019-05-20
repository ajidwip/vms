import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailvisitingPage } from './detailvisiting';
import { SafePipe } from '../../pipes/safe/safe';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    DetailvisitingPage,
    SafePipe
  ],
  imports: [
    IonicPageModule.forChild(DetailvisitingPage),
    IonicImageViewerModule
  ],
})
export class DetailvisitingPageModule {}
