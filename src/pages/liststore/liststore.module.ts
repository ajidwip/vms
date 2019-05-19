import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListstorePage } from './liststore';

@NgModule({
  declarations: [
    ListstorePage,
  ],
  imports: [
    IonicPageModule.forChild(ListstorePage),
  ],
})
export class ListstorePageModule {}
