import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailstorePage } from './detailstore';
import { PipesModule } from '../../pipes/pipes.module';
import { IonicImageViewerModule } from 'ionic-img-viewer';


@NgModule({
  declarations: [
    DetailstorePage
  ],
  imports: [
    IonicPageModule.forChild(DetailstorePage),
    IonicImageViewerModule,
    PipesModule
  ],
})
export class DetailstorePageModule {}
