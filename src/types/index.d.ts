import { ShoppingCart, User } from '../model';

import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    isLogged: boolean;
    user: User;
    shoppingCart: ShoppingCart;
  }
}
