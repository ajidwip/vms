import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailstorePage } from './detailstore';
import { SafePipe } from '../../pipes/safe/safe';
import { IonicImageViewerModule } from 'ionic-img-viewer';


@NgModule({
  declarations: [
    DetailstorePage,
    SafePipe
  ],
  imports: [
    IonicPageModule.forChild(DetailstorePage),
    IonicImageViewerModule
  ],
})
export class DetailstorePageModule {}
