import {Component, NgModule, Input, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DxListModule} from 'devextreme-angular/ui/list';
import {DxContextMenuModule} from 'devextreme-angular/ui/context-menu';
import {Observable, Subscription} from 'rxjs';
import {UserInfoModel} from '@app/shared/models';
import {UsersService} from '@app/shared/services';
import {BalanceService} from '@services/balance.service';


@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent implements OnInit, OnDestroy {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;

  balance: number;

  sub: Subscription;

  userInfo$: Observable<UserInfoModel>;
  balanceChanged = false;

  constructor(private userService: UsersService, public balanceService: BalanceService) {
    this.balance = 0;
  }

  ngOnInit(): void {
    this.userInfo$ = this.userService.getSelfInfo();

    this.sub = this.balanceService.userBalance.subscribe(balance => {
      console.log('balance changed');
      this.balance = balance;
      console.log({balance});
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

@NgModule({
  imports: [
    DxListModule,
    DxContextMenuModule,
    CommonModule
  ],
  declarations: [UserPanelComponent],
  exports: [UserPanelComponent]
})
export class UserPanelModule {
}
