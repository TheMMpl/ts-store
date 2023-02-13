import { Router } from 'express';
import type { Request, Response } from 'express';

import Product from '../model/product';
import Money from '../model/money';
import ShoppingCart from '../model/shoppingCart';

const storeRouter = Router();

storeRouter.get('/', (req: Request, res: Response) => {
  res.render('index');
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

storeRouter.get('/cart', (req: Request, res: Response) => {
  if (req.session.shoppingCart == null)
    req.session.shoppingCart = new ShoppingCart();
  res.render('cart', {
    totalCost: ShoppingCart.getTotalCost(req.session.shoppingCart).toDecimal(),
  });
});

storeRouter.get('/product', async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    if (id == null) {
      res.status(400).send('Invalid product id.');
      return;
    }
    const prodId = Number.parseInt(id.toString());
    const product = await Product.findProductById(prodId);
    if (product == null) {
      res.status(400).send('No product found.');
      return;
    }

    res.render('product', {
      product: product,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

storeRouter.post('/add_to_cart', async (req: Request, res: Response) => {
  try {
    if (req.session.shoppingCart == null)
      req.session.shoppingCart = new ShoppingCart();
    const id = req.body.id;
    const quantity = Number.parseInt(req.body.quantity.toString());
    const prodId = Number.parseInt(id.toString());
    const product = await Product.findProductById(prodId);
    if (product == null) {
      res.status(400).send('No product found.');
      return;
    }
    ShoppingCart.addProduct(req.session.shoppingCart, product, quantity);
    res.redirect('product?id=' + id);
  } catch (error) {
    res.status(400).send(error);
  }
});

// storeRouter.get('/order', (req: Request, res: Response) => {
//   try {
//     (async () => {
//       // Order.placeOrder()
//     })();
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

export default storeRouter;
