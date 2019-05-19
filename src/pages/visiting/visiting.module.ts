import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitingPage } from './visiting';

@NgModule({
  declarations: [
    VisitingPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitingPage),
  ],
})
export class VisitingPageModule {}
