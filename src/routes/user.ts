import { Router } from 'express';
import type { Request, Response } from 'express';

import { Category, Order, User } from '../model';

const userRouter = Router();

userRouter.get('/profile', async (req: Request, res: Response) => {
  try {
    if (!req.session.isLogged || req.session.user == null) {
      res.redirect('/login');
      return;
    }

    if (req.session.user.role === 'admin') {
      res.redirect('/admin');
      return;
    }

    res.render('profile', {
      orders: await Order.getOrders(req.session.user.id),
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.get('/admin', async (req: Request, res: Response) => {
  try {
    if (!req.session.isLogged || req.session.user == null) {
      res.redirect('/login');
      return;
    }

    if (req.session.user.role === 'user') {
      res.redirect('/profile');
      return;
    }

    res.render('admin', {
      orders: await Order.getOrders(),
      users: await User.getUsers(),
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default userRouter;
