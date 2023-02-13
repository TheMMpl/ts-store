import User from './model/user';
import ShoppingCart from './model/shoppingCart';

import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    isLogged: boolean;
    user: User;
    shoppingCart: ShoppingCart;
  }
}
