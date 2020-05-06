import {Component, HostBinding} from '@angular/core';

import {Router} from '@angular/router';
import {AppInfoService, AuthService, ScreenService} from '@app/shared/services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  constructor(private router: Router,
              private authService: AuthService,
              private screen: ScreenService,
              public appInfo: AppInfoService
  ) {
  }

  isAuthorized() {
    return this.authService.loggedIn();
  }
}
