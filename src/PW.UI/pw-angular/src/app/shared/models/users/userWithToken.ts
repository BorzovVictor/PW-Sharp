import {User} from '@app/shared/models/users/user';

export interface UserWithToken extends User {
  token?: string;
}
