import {Component, OnInit, ViewChild} from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import {DxDataGridComponent} from 'devextreme-angular';
import {TransferDocument, User, UserLookUpModel} from '../../shared/models';
import {TransferDocumentsService} from '@services/transfer-documents.service';
import {UsersService} from '@services/users.service';
import {DxHelpersService} from '@app/shared/helpers';

import * as fromDocuments from '@app/store/reducers/trnsfer-doc.reducer';
import {Store} from '@ngrx/store';
import {getCurrentUser} from '@app/store/reducers/users.reducer';

@Component({
  selector: 'app-transfer-pw',
  templateUrl: './transfer-pw.component.html',
  styleUrls: ['./transfer-pw.component.css']
})
export class TransferPwComponent implements OnInit {
  @ViewChild('userGrid') dataGrid: DxDataGridComponent;
  dataStore: CustomStore;
  userStore: {};
  userLookUpStore: {};
  focusedRow: TransferDocument;
  transferBase = false;
  currentUser: User;
  popupTitle: string;

  toolbarItems: any;

  constructor(private service: TransferDocumentsService,
              private dxHelpers: DxHelpersService,
              private userService: UsersService,
              private store: Store<fromDocuments.State>
  ) {

    this.createUserStore();
    this.loadUserLookUpStore();
    this.createDataSource();

    this.toolbarItems = [];
    this.store.select(getCurrentUser).subscribe((user: User) => {
        this.currentUser = user;
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
  }

  createDataSource() {
    this.dataStore = new CustomStore({
      key: 'id',
      load: (loadOptions: any) => {
        return this.service.load();
      },
      insert: (values) => {
        const result = this.service.create(values);
        return this.dxHelpers.checkCRUDresult(result);
      }
    });
  }

  createUserStore() {
    this.userStore = {
      store: new CustomStore({
        key: 'id',
        load: (loadOptions: any) => {
          if (loadOptions.searchValue != null) {
            if (loadOptions.searchValue.toString().length > 2) {
              console.log('userStore.load');
              return this.userService.loadAll(loadOptions).toPromise();
            }
          } else {
            return this.userService.loadAll(loadOptions).toPromise();
          }
        },
        byKey: (key: number) => {
          return this.userService.getById(key).toPromise();
        }
      })
    };
  }

  loadUserLookUpStore() {
    this.userLookUpStore = {
      store: new CustomStore({
        key: 'id',
        load: (loadOptions: any) => {
          console.log({loadOptions});
          if (loadOptions.searchValue != null) {
            console.log({loadOptions});
            if (loadOptions.searchValue.toString().length > 2) {
              return this.userService.load(loadOptions).toPromise();
            }
          } else {
            console.log('userLookUpStore');
            return this.userService.load(loadOptions).toPromise();
          }
        },
        byKey: (key: number) => {
          return this.userService.getById(key).toPromise();
        }
      })
    };
  }

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

    // this.toolbarItems.forEach(item => {
    //   if (item.name === 'addRowButton') {
    //     item.options.hint = 'transfer money';
    //     item.options.icon = 'money';
    //   }
    // });
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
    this.userService.balanceChanged();
  }
}
