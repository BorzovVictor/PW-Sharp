import {Component, OnInit, ViewChild} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import {TransactionModel, TransferNewDocumentModel, UserInfoModel} from '@app/shared/models';
import {DxHelpersService} from '@app/shared/helpers';
import {TransactionsService, TransferDocumentsService, UsersService} from '@app/shared/services';
import {BalanceService} from '@services/balance.service';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  @ViewChild('userGrid') dataGrid: DxDataGridComponent;
  dataStore: CustomStore;
  userStore: {};
  userLookUpStore: {};
  focusedRow: TransactionModel;
  transferBase = false;
  currentUser: UserInfoModel;
  popupTitle: string;
  toolbarItems: any;

  constructor(private service: TransactionsService,
              private docService: TransferDocumentsService,
              private dxHelpers: DxHelpersService,
              private balanceService: BalanceService,
              private userService: UsersService) {
    this.createDataSource();
    this.createUserStore();
    this.loadUserLookUpStore();
    this.userService.getSelfInfo().subscribe(value => {
      this.currentUser = value;
    }, error => {
      console.log({error});
    });
  }

  ngOnInit() {
  }

  createDataSource() {
    this.dataStore = new CustomStore({
      key: 'id',
      load: (loadOptions: any) => {
        return this.service.loadData(loadOptions).toPromise();
      },
      insert: (values) => {
        // console.log(values);
        const model = ({} as TransferNewDocumentModel);
        model.recipient = values.corresponded;
        model.amount = values.amount;
        model.description = values.descriptions;
        const result = this.docService.create(model).toPromise()
          .then((data: any) => {
            console.log(data);
            this.balanceService.add(data.amount * -1);
            return {
              data: data.data,
              totalCount: data.totalCount,
              summary: data.summary,
              groupCount: data.groupCount
            };
          })
          .catch(error => {
            throw error;
          });
        return result;
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
          if (loadOptions.searchValue != null) {
            if (loadOptions.searchValue.toString().length > 2) {
              return this.userService.load(loadOptions).toPromise();
            }
          } else {
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
    this.popupTitle = this.transferBase ? 'Повтор выполненого перевода' : 'Новый перевод';
    if (this.transferBase) {
      console.log({e});
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
        hint: 'выолнить перевод',
        onClick: this.createTransfer.bind(this)
      }
    });
    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'repeat',
        hint: 'повторить перевод',
        onClick: this.createBaseTransfer.bind(this)
      }
    });
    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'refresh',
        hint: 'обновить данные',
        onClick: this.refreshDataGrid.bind(this)
      }
    });
    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'exportxlsx',
        hint: 'сохранить данные в Excel',
        onClick: this.exportDataGrid.bind(this)
      }
    });
    this.toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'columnchooser',
        hint: 'выбор столбцов',
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
    if (this.currentUser) {
      this.toolbarItems[1].disabled = this.focusedRow.transactionType === 2;
    }
  }

  onRowInserted(e: any) {
    this.userService.balanceChanged();
  }
}

