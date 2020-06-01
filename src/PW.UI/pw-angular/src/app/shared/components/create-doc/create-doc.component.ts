import {ChangeDetectionStrategy, Component, Input, NgModule, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Transaction, TransferNewDocumentModel, UserLookUpModel} from '@app/shared/models';
import {DxFormModule} from 'devextreme-angular';
import * as userActions from '@app/user/state/users.action';
import {select, Store} from '@ngrx/store';
import * as fromUsers from '@app/user/state';
import {Observable} from 'rxjs';
import {SharedModule} from '@app/shared/shared.module';
import {UserState} from '@app/user/state/users.reducer';

@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrls: ['./create-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDocComponent implements OnInit, OnChanges {

  @Input() editRecord: Transaction;

  users$: Observable<UserLookUpModel[]>;
  usersErrorMessage$: Observable<string>;
  model: TransferNewDocumentModel;

  buttonOptions: any = {
    text: 'Confirm',
    type: 'success',
    useSubmitBehavior: true
  };

  constructor(private store: Store<UserState>) {
    this.model = ({} as TransferNewDocumentModel);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editRecord) {
      this.model.description = this.editRecord.descriptions;
      this.model.recipient = this.editRecord.corresponded;
      this.model.amount = this.editRecord.amount * -1;
    } else {
      console.log('on change empty', this.editRecord);
      this.model.description = '';
      this.model.recipient = null;
      this.model.amount = null;
    }
  }

  ngOnInit() {
    // create user store
    this.store.dispatch(new userActions.Load());
    this.users$ = this.store.pipe(select(fromUsers.getUsers));
    this.usersErrorMessage$ = this.store.pipe(select(fromUsers.getError));
  }

  onFormSubmit(event: Event) {

    // event.preventDefault();
  }
}

@NgModule({
  declarations: [CreateDocComponent],
  imports: [
    DxFormModule,
    SharedModule
  ],
  exports: [CreateDocComponent]
})
export class CreateDocModule {
}
