import { Router } from 'express';
import type { Request, Response } from 'express';

import User from '../model/user';
import { hash, compare } from 'bcrypt';

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
      console.log('Found!');
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

// router.get('/user', (req: Request, res: Response) => {
//   // User profile
// });

export default router;
