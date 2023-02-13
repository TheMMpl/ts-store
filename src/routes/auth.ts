import { Router } from 'express';
import type { Request, Response } from 'express';

import { User } from '../model';
import { hash, compare } from 'bcrypt';

const authRouter = Router();

authRouter.get('/login', (req: Request, res: Response) => {
  if (req.session.isLogged) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    if (req.session.isLogged) {
      res.redirect('/');
      return;
    }

    const email: string = req.body.email;
    const password: string = req.body.password;

    const foundUser = await User.findByEmail(email);
    if (foundUser == null) {
      res.render('login');
      return;
    }
    compare(password, foundUser.password, (err, same) => {
      if (same) {
        req.session.isLogged = true;
        req.session.user = foundUser;
        res.redirect('/');
      } else {
        res.render('login');
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.get('/register', (req: Request, res: Response) => {
  if (req.session.isLogged) {
    res.redirect('/');
    return;
  }
  res.render('register');
});

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    if (req.session.isLogged) {
      res.redirect('/');
      return;
    }

    const email: string = req.body.email;
    const password: string = req.body.password;
    const foundUser = await User.findByEmail(email);
    if (foundUser === null) {
      const hashed = await hash(password, 10);
      req.session.isLogged = true;
      req.session.user = await User.addUser({
        email: email,
        password: hashed,
        role: 'user',
      });
      res.redirect('/');
    } else {
      res.render('register');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.all('/logout', (req: Request, res: Response) => {
  req.session.isLogged = false;
  req.session.user = undefined;

  res.redirect('/');
});

export default authRouter;
