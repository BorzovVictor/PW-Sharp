import {UserInfoModel} from '@app/shared/models/users/user-info.model';

export interface User extends UserInfoModel {
  token?: string;
}
