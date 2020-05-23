import {Component, NgModule, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DxListModule} from 'devextreme-angular/ui/list';
import {DxContextMenuModule} from 'devextreme-angular/ui/context-menu';
import {Observable} from 'rxjs';
import {User} from '@app/shared/models';
import {UsersService} from '@app/shared/services';
import {select, Store} from '@ngrx/store';
import * as fromUser from '../../../store/reducers/users.reducer';
import {getCurrentUser} from '../../../store/reducers/users.reducer';


@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent implements OnInit {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;

  currentUser: User;

  userInfo$: Observable<User>;

  constructor(
    private userService: UsersService,
    private store: Store<fromUser.UserState>) {
  }

  ngOnInit(): void {

    this.userService.getSelfInfo().then((user: User) => {
      this.currentUser = user;
    });
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
