import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {takeWhile} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DxDataGridComponent} from 'devextreme-angular';
import {DxHelpersService} from '@app/shared/helpers';
import {select, Store} from '@ngrx/store';

import {UserService} from '@app/user/user.service';
import {TransferDocument, TransferNewDocumentModel, User, UserLookUpModel} from '../../shared/models';
import {TransferDocumentsService} from '@app/pages/transfer-pw/transfer-documents.service';

import * as fromDocuments from '@app/pages/transfer-pw/state/';
import * as userActions from '@app/user/state/users.action';
import * as fromUsers from '@app/user/state';
import * as docActions from './state/documents.actions';


@Component({
  selector: 'app-transfer-pw',
  templateUrl: './transfer-pw.component.html',
  styleUrls: ['./transfer-pw.component.css']
})
export class TransferPwComponent implements OnInit, OnDestroy {
  @ViewChild('userGrid') dataGrid: DxDataGridComponent;

  documents: TransferDocument[];
  docErrorMessage$: Observable<string>;
  users$: Observable<UserLookUpModel[]>;
  usersErrorMessage$: Observable<string>;

  focusedRow: TransferDocument;
  transferBase = false;
  currentUser: User;
  popupTitle: string;

  toolbarItems: any;
  private componentActive = true;


  constructor(private service: TransferDocumentsService,
              private dxHelpers: DxHelpersService,
              private userService: UserService,
              private store: Store<fromDocuments.State>
  ) {

    this.toolbarItems = [];
  }

  ngOnInit() {
    // getCurrentUser
    this.store.dispatch(new userActions.GetCurrentUser());
    this.store.pipe(select(fromUsers.getCurrentUser),
      takeWhile(() => this.componentActive))
      .subscribe((user: User) => this.currentUser = user);

    // create user store
    this.store.dispatch(new userActions.Load());
    this.users$ = this.store.pipe(select(fromUsers.getUsers));
    this.usersErrorMessage$ = this.store.pipe(select(fromUsers.getError));

    // create data store
    this.store.dispatch(new docActions.Load());
    this.store.pipe(select(fromDocuments.getDocuments), takeWhile(() => this.componentActive))
      .subscribe((values: TransferDocument[]) => {
        this.documents = values;
        this.store.dispatch(new userActions.GetCurrentUser());
      });
    this.docErrorMessage$ = this.store.pipe(select(fromDocuments.getError));
  }

  //
  // createDataSource() {
  //   this.dataStore = new CustomStore({
  //     key: 'id',
  //     load: (loadOptions: any) => {
  //       return this.service.load();
  //     },
  //     insert: (values) => {
  //       const result = this.service.create(values).toPromise()
  //         .then((data: any) => {
  //           // this.userService.getSelfInfo();
  //           this.store.dispatch(new userActions.GetCurrentUser());
  //           return {
  //             data: data.data,
  //             totalCount: data.totalCount,
  //             summary: data.summary,
  //             groupCount: data.groupCount
  //           };
  //         })
  //         .catch(error => {
  //           throw error;
  //         });
  //       return this.dxHelpers.checkCRUDresult(result);
  //     }
  //   });
  // }
  //
  // createUserStore() {
  //   this.store.dispatch(new userActions.Load());
  //   this.users$ = this.store.pipe(select(fromUsers.getUsers));
  //   this.usersErrorMessage$ = this.store.pipe(select(fromUsers.getError));
  // }
  //
  // // createUserStore() {
  // //   this.userStore = {
  // //     store: new CustomStore({
  // //       key: 'id',
  // //       load: (loadOptions: any) => {
  // //         if (loadOptions.searchValue != null) {
  // //           if (loadOptions.searchValue.toString().length > 2) {
  // //             console.log('userStore.load');
  // //             return this.userService.loadAll(loadOptions).toPromise();
  // //           }
  // //         } else {
  // //           return this.userService.loadAll(loadOptions).toPromise();
  // //         }
  // //       },
  // //       byKey: (key: number) => {
  // //         return this.userService.getById(key).toPromise();
  // //       }
  // //     })
  // //   };
  // // }
  // loadUserLookUpStore() {
  //   // this.userLookUpStore = {
  //   //   store: new CustomStore({
  //   //     key: 'id',
  //   //     load: (loadOptions: any) => {
  //   //       console.log({loadOptions});
  //   //       if (loadOptions.searchValue != null) {
  //   //         console.log({loadOptions});
  //   //         if (loadOptions.searchValue.toString().length > 2) {
  //   //           return this.userService.load(loadOptions);
  //   //         }
  //   //       } else {
  //   //         console.log('userLookUpStore');
  //   //         return this.userService.load(loadOptions);
  //   //       }
  //   //     },
  //   //     byKey: (key: number) => {
  //   //       return this.userService.getById(key).toPromise();
  //   //     }
  //   //   })
  //   // };
  // }

  onInitNewRow(e: any) {
    console.log(this.transferBase);
    this.popupTitle = this.transferBase ? 'Repeat a completed transaction' : 'New transaction';
    if (this.transferBase) {
      e.data.recipient = this.focusedRow.recipient;
      e.data.amount = this.focusedRow.amount;
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
        icon: 'fa fa-share-square',
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
    this.transferBase = this.focusedRow.recipient !== this.currentUser.id;
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
    if (this.currentUser) {
      this.toolbarItems[1].disabled = this.focusedRow.recipient === this.currentUser.id;
    }
  }

  onRowInserted(e: any) {
    // this.userService.balanceChanged();
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  onRowInserting(e: any) {
    console.log(e);
    const model = ({
      recipient: e.data.recipient,
      amount: e.data.amount,
      description: e.data.description
    } as TransferNewDocumentModel);

    this.store.dispatch(new docActions.Create(model));

    e.cancel = true;
    e.component.cancelEditData();
  }
}
