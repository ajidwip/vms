import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListpicturevisitingPage } from './listpicturevisiting';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    ListpicturevisitingPage,
  ],
  imports: [
    IonicPageModule.forChild(ListpicturevisitingPage),
    IonicImageViewerModule
  ],
})
export class ListpicturevisitingPageModule {}
