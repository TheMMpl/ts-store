import { Router } from 'express';
import type { Request, Response } from 'express';

import Category from '../model/category';
import User from '../model/user';
import { hash, compare } from 'bcrypt';
import Product from '../model/product';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index.ejs');
});

router.get('/test', (req: Request, res: Response) => {
  res.render('test');
});

router.get('/w', (req: Request, res: Response) => {
  res.render('w');
});

router.get('/login', (req: Request, res: Response) => {
  if (req.session.isLogged) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.post('/login', (req: Request, res: Response) => {
  if (req.session.isLogged) {
    res.redirect('/');
    return;
  }
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    (async () => {
      const foundUser = await User.findByEmail(email);
      if (foundUser !== null) {
        compare(password, foundUser.password, (err, same) => {
          if (same) {
            req.session.isLogged = true;
            req.session.user = foundUser;
            res.redirect('/');
          } else {
            res.render('login');
          }
        });
      } else {
        res.render('login');
      }
    })();
  } catch (error) {
    // res.status(400).send(error);
  }
});

router.get('/register', (req: Request, res: Response) => {
  if (req.session.isLogged) {
    res.redirect('/');
    return;
  }
  res.render('register');
});

router.post('/register', (req: Request, res: Response) => {
  if (req.session.isLogged) {
    res.redirect('/');
    return;
  }

  try {
    (async () => {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const foundUser = await User.findByEmail(email);
      if (foundUser === null) {
        const hashed = await hash(password, 10);
        const newUser: User = {
          email: email,
          password: hashed,
          role: 'user',
        };
        await User.addUser(newUser);
        req.session.isLogged = true;
        req.session.user = newUser;
        res.redirect('/');
      } else {
        // Email already exists
        res.render('register');
      }
    })();
  } catch (error) {
    // res.status(400).send(error);
  }
});

router.all('/logout', (req: Request, res: Response) => {
  req.session.isLogged = false;
  req.session.user = null;

  res.redirect('/');
});

router.get('/profile', (req: Request, res: Response) => {
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
    // res.status(400).send(error);
  }
});

router.post('/add_product', (req: Request, res: Response) => {
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
      const prodPrice: number = Number.parseInt(
        (Number.parseFloat(req.body.price) * 100).toFixed(0)
      );
      // const prodImg: string = req.body.
      const prodCategory: string[] = req.body.categories;
      if (
        !(prodName && prodDesc && prodPrice > 0.0 && prodCategory.length > 0)
      ) {
        res.redirect('/profle');
        return;
      }
      const newProduct = {
        name: prodName,
        description: prodDesc,
        price: prodPrice,
        img_url: 'assets/product_no_image.png',
      };
      Product.addProduct(newProduct);
      res.render('profile', {
        user: req.session.user,
        categories: categoryData,
      });
    })();
  } catch (error) {
    // res.status(400).send(error);
  }
});

export default router;
