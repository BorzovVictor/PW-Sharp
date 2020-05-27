import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {transactionsReducer} from '@app/pages/transactions/state/transactions.reducer';
import {TransactionEffects} from '@app/pages/transactions/state/transaction.effects';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    StoreModule.forFeature('transactions', transactionsReducer),
    EffectsModule.forFeature([TransactionEffects]),
  ]
})
export class TransactionModule {
}
