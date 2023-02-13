import { Router } from 'express';
import type { Request, Response } from 'express';

import Category from '../model/category';

const userRouter = Router();

userRouter.get('/profile', (req: Request, res: Response) => {
  try {
    (async () => {
      if (!req.session.isLogged || req.session.user == null) {
        res.redirect('/login');
        return;
      }
      const categoryData =
        req.session.user.role === 'admin'
          ? await Category.getCategories()
          : null;
      res.render('profile', {
        user: req.session.user,
        categories: categoryData,
      });
    })();
  } catch (error) {
    res.status(400).send(error);
  }
});

// userRouter.get('/admin', (req: Request, res: Response) => {
//   res.render('admin');
// });

userRouter.get('/admin', (req: Request, res: Response) => {
  try {
    (async () => {
      if (!req.session.isLogged || req.session.user == null) {
        res.redirect('/login');
        return;
      }
      const categoryData =
        req.session.user.role === 'admin'
          ? await Category.getCategories()
          : null;
      res.render('admin', {
        user: req.session.user,
        categories: categoryData,
      });
    })();
  } catch (error) {
    res.status(400).send(error);
  }
});

export default userRouter;
