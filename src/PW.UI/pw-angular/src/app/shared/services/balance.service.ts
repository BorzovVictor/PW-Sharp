import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {UsersService} from '@services/users.service';

@Injectable({providedIn: 'root'})
export class BalanceService {
  private currBalance: BehaviorSubject<number>;
  public userBalance: Observable<number>;

  constructor(private userService: UsersService) {
    this.currBalance = new BehaviorSubject<number>(0);
    this.userService.getSelfInfo().toPromise()
      .then(userInfo => {
        this.currBalance.next(userInfo.currentBalance);
      });
    this.userBalance = this.currBalance.asObservable();
  }

  changeBalance(newBalance: number) {
    this.currBalance.next(newBalance);
  }

  add(value: number) {
    const currBalance = this.currBalance.value + value;
    this.currBalance.next(currBalance);
  }

  clearBalance() {
    this.currBalance.next(0);
  }

  onChange() {
    this.userService.getSelfInfo().toPromise()
      .then(userInfo => {
        console.log(`onChange: ${userInfo}`);
        this.currBalance.next(userInfo.currentBalance);
      });
  }

  public get currentBalance(): number {
    return this.currBalance.value;
  }
}
