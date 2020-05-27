import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import {Transaction, TransferNewDocumentModel, User, UserLookUpModel} from '@app/shared/models';
import {DxHelpersService} from '@app/shared/helpers';
import {TransactionService, TransferDocumentsService, UserService} from '@app/shared/services';
import {select, Store} from '@ngrx/store';
import {takeWhile} from 'rxjs/operators';

import * as fromTransaction from '@app/pages/transactions/state';
import * as tranActions from './state/transactions.action';
import * as fromUsers from '@app/user/state';
import * as userActions from '@app/user/state/users.action';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  @ViewChild('userGrid') dataGrid: DxDataGridComponent;
  dataStore: CustomStore;

  focusedRow: Transaction;
  transferBase = false;
  currentUser: User;
  popupTitle: string;
  toolbarItems: any;

  componentActive = true;

  users$: Observable<UserLookUpModel[]>;
  usersErrorMessage$: Observable<string>;

  transactions$: Observable<Transaction[]>;
  transactions: Transaction[];
  tranErrorMessage$: Observable<string>;


  constructor(private service: TransactionService,
              private docService: TransferDocumentsService,
              private dxHelpers: DxHelpersService,
              private userService: UserService,
              private store: Store<fromTransaction.State>) {
    this.getCurrentUser();
    this.createUserStore();
    this.createDataSource();
  }

  ngOnInit() {

  }

  getCurrentUser() {
    this.store.dispatch(new userActions.GetCurrentUser());
    this.store.pipe(select(fromUsers.getCurrentUser),
      takeWhile(() => this.componentActive))
      .subscribe((user: User) => this.currentUser = user);
  }

  createDataSource() {

    this.store.dispatch(new tranActions.Load());
    this.store.pipe(select(fromTransaction.getTransactions), takeWhile(() => this.componentActive))
      .subscribe((values: Transaction[]) => this.transactions = values);
    this.tranErrorMessage$ = this.store.pipe(select(fromTransaction.getError));

    // this.dataStore = new CustomStore({
    //   key: 'id',
    //   load: (loadOptions: any) => {
    //     this.store.dispatch(new tranActions.Load());
    //     return this.store.pipe(select(fromTransaction.getTransactions)).toPromise();
    //   },
    //   insert: (values) => {
    //     const model = ({} as TransferNewDocumentModel);
    //     model.recipient = values.corresponded;
    //     model.amount = values.amount;
    //     model.description = values.descriptions;
    //
    //     this.store.dispatch(new tranActions.Create(model));
    //     return this.store.pipe(select(fromTransaction.getTransactions), takeWhile(() => this.componentActive))
    //       .subscribe((transactions: Transaction[]) => {
    //         return {
    //           data: transactions,
    //           totalCount: transactions.length
    //         };
    //       });
    //   }
    // });
  }

  createUserStore() {
    this.store.dispatch(new userActions.Load());
    this.users$ = this.store.pipe(select(fromUsers.getUsers));
    this.usersErrorMessage$ = this.store.pipe(select(fromUsers.getError));
  }

  onInitNewRow(e: any) {
    this.popupTitle = this.transferBase ? 'Repeat a completed transaction' : 'New transaction';
    if (this.transferBase) {
      e.data.corresponded = this.focusedRow.corresponded;
      e.data.amount = this.focusedRow.amount * -1;
    }
  }

  onToolbarPreparing(e: any) {
    this.toolbarItems = e.toolbarOptions.items;

    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'money',
        hint: 'transfer money',
        onClick: this.createTransfer.bind(this)
      }
    });
    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'repeat',
        hint: 'repeat transfer',
        onClick: this.createBaseTransfer.bind(this)
      }
    });
    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'refresh',
        hint: 'refresh',
        onClick: this.refreshDataGrid.bind(this)
      }
    });
    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'exportxlsx',
        hint: 'export data to Excel',
        onClick: this.exportDataGrid.bind(this)
      }
    });
    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'columnchooser',
        hint: 'choose columns',
        onClick: this.columnChooserButton.bind(this)
      }
    });
  }

  createTransfer() {
    this.transferBase = false;
    this.dataGrid.instance.addRow();
  }

  createBaseTransfer() {
    this.transferBase = this.focusedRow.corresponded !== this.currentUser.id;
    this.dataGrid.instance.addRow();
  }

  exportDataGrid(e) {
    this.dataGrid.instance.exportToExcel(false);
  }

  columnChooserButton(e) {
    this.dataGrid.instance.showColumnChooser();
  }

  refreshDataGrid() {
    this.dataGrid.instance.refresh();
  }

  onFocusedRowChanged(e: any) {
    this.focusedRow = e.row.data;
    console.log(e.row.data);
    if (this.currentUser) {
      this.toolbarItems[1].disabled = this.focusedRow.transactionType === 2;
    }
  }

  onRowInserted(e: any) {
    console.log(e);
    // this.userService.balanceChanged();
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  onRowInserting(e: any) {
    console.log(e);
  }
}

