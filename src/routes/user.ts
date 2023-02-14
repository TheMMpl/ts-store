import { Router } from 'express';
import type { Request, Response } from 'express';

import { Order, Product, User } from '../model';

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

    const orders = await Order.getOrders(req.session.user.id);
    let prodNames: { [key: number]: string } = {};
    for (const order of orders) {
      for (const prod of order.products) {
        const curProd = await Product.findProductById(prod[0]);
        if (curProd == null) prodNames[prod[0]] = 'Deleted product';
        else prodNames[prod[0]] = curProd.name;
      }
    }
    res.render('profile', {
      orders: orders,
      names: prodNames,
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

    const orders = await Order.getOrders();
    let prodNames: { [key: number]: string } = {};
    for (const order of orders) {
      for (const prod of order.products) {
        const curProd = await Product.findProductById(prod[0]);
        if (curProd == null) prodNames[prod[0]] = 'Deleted product';
        else prodNames[prod[0]] = curProd.name;
      }
    }
    res.render('admin', {
      orders: orders,
      users: await User.getUsers(),
      names: prodNames,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default userRouter;
