import {Component, Input, NgModule, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DxListModule} from 'devextreme-angular/ui/list';
import {DxContextMenuModule} from 'devextreme-angular/ui/context-menu';
import {User} from '@app/shared/models';
import {UserService} from '@services/index';
import {select, Store} from '@ngrx/store';
import * as fromUser from '../state/users.reducer';
import * as fromUsers from '@app/user/state';
import * as userActions from '@app/user/state/users.action';
import {takeWhile} from 'rxjs/operators';

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

  currentUser: User;
  private componentActive = true;

  constructor(
    private userService: UserService,
    private store: Store<fromUser.UserState>) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.store.dispatch(new userActions.GetCurrentUser());
    this.store.pipe(select(fromUsers.getCurrentUser),
      takeWhile(() => this.componentActive))
      .subscribe((user: User) => this.currentUser = user);
  }

  ngOnDestroy(): void {
    this.componentActive = false;
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
