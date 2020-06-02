import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {StoreModule} from '@ngrx/store';

import {EffectsModule} from '@ngrx/effects';
import {transferDocReducer} from '@app/pages/transfer-pw/state/trnsfer-doc.reducer';
import {DocumentEffects} from '@app/pages/transfer-pw/state/document.effects';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    StoreModule.forFeature('documents', transferDocReducer),
    EffectsModule.forFeature([DocumentEffects]),
  ]
})
export class DocumentModule {
}
