import { Router } from 'express';
import type { Request, Response } from 'express';

import Product from '../model/product';
import Money from '../model/money';

const storeRouter = Router();

storeRouter.get('/', (req: Request, res: Response) => {
  res.render('index.ejs');
});

storeRouter.post('/add_product', (req: Request, res: Response) => {
  try {
    (async () => {
      if (
        !req.session.isLogged ||
        req.session.user == null ||
        req.session.user.role != 'admin'
      ) {
        res.redirect('/');
        return;
      }
      const prodName: string = req.body.name;
      const prodDesc: string = req.body.description;
      const prodPrice: Money = Money.ofDecimal(req.body.price);
      const prodCategory: number[] = req.body.categories;
      if (
        !(
          prodName &&
          prodDesc &&
          prodPrice.amount > 0 &&
          prodCategory &&
          prodCategory.length > 0
        )
      ) {
        res.redirect('/profile');
        return;
      }
      Product.addProduct({
        name: prodName,
        description: prodDesc,
        price: prodPrice,
        img_url: 'assets/product_no_image.png',
        categories: prodCategory,
      });
      res.redirect('/profile');
    })();
  } catch (error) {
    res.status(400).send(error);
  }
});

storeRouter.get('/order', (req: Request, res: Response) => {
  try {
    (async () => {
      // Order.placeOrder()
    })();
  } catch (error) {
    res.status(400).send(error);
  }
});

export default storeRouter;
