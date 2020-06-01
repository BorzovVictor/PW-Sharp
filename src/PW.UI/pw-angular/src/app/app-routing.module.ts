import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginFormComponent, RegisterFormComponent} from './shared/components';

import {HomeComponent} from './pages/home/home.component';
import {DxButtonModule, DxDataGridModule, DxFormModule, DxPopupModule} from 'devextreme-angular';
import {TransactionsComponent} from './pages/transactions/transactions.component';
import {TransferPwComponent} from '@app/pages/transfer-pw/transfer-pw.component';
import {AuthGuard} from '@app/shared/services';
import {SharedModule} from '@app/shared/shared.module';
import {CreateDocModule} from '@app/shared/components/create-doc/create-doc.component';

const routes: Routes = [
  {
    path: 'pages/transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/transfer-pw',
    component: TransferPwComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login-form',
    component: LoginFormComponent
  },
  {
    path: 'register-form',
    component: RegisterFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), DxDataGridModule, DxFormModule, SharedModule, DxPopupModule, CreateDocModule, DxButtonModule],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    TransactionsComponent,
    TransferPwComponent
  ]
})
export class AppRoutingModule {
}
