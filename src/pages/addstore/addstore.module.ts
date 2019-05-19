import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddstorePage } from './addstore';

@NgModule({
  declarations: [
    AddstorePage,
  ],
  imports: [
    IonicPageModule.forChild(AddstorePage),
  ],
})
export class AddstorePageModule {}
