import { Router } from 'express';
import type { Request, Response } from 'express';

import { ShoppingCart, Money, Product, Order } from '../model';

const storeRouter = Router();

storeRouter.get('/', async (req: Request, res: Response) => {
  const newestProds = await Product.getLatestProducts(4);

  res.render('index', {
    latest: newestProds.map((entry) => {
      return {
        id: entry.id,
        img_url: entry.img_url,
        name: entry.name,
        price: entry.price,
      };
    }),
  });
});

storeRouter.post('/add_product', async (req: Request, res: Response) => {
  try {
    if (
      !req.session.isLogged ||
      req.session.user == null ||
      req.session.user.role !== 'admin'
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
      res.redirect('/admin');
      return;
    }
    Product.addProduct({
      name: prodName,
      description: prodDesc,
      price: prodPrice,
      img_url: 'assets/product_no_image.png',
      categories: prodCategory,
    });
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error);
  }
});

storeRouter.get('/cart', (req: Request, res: Response) => {
  if (req.session.shoppingCart == null)
    req.session.shoppingCart = new ShoppingCart();

  const cart: ShoppingCart = req.session.shoppingCart;
  const items = cart.products.map((entry) => {
    return {
      product: entry.product,
      price: Money.toDecimal(entry.product.price.amount),
      quantity: entry.quantity,
      totalPrice: Money.mult(entry.product.price, entry.quantity).toDecimal(),
    };
  });

  res.render('cart', {
    items: items,
    totalPrice: ShoppingCart.getTotalCost(cart).toDecimal(),
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

storeRouter.post('/order', async (req: Request, res: Response) => {
  try {
    if (
      !req.session.isLogged ||
      req.session.user == null ||
      req.session.shoppingCart == null ||
      req.session.shoppingCart.products.length == 0
    ) {
      res.redirect('cart');
      return;
    }

    const cart: ShoppingCart = req.session.shoppingCart;
    await Order.placeOrder(cart, req.session.user.id);
    req.session.shoppingCart = new ShoppingCart();
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error);
  }
});

export default storeRouter;
