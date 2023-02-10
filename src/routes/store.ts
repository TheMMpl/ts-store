import { Router } from 'express';
import type { Request, Response } from 'express';

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

export default router;
