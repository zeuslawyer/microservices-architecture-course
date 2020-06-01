import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/signin', (req: Request, res: Response) => {
  res.send(`sign in service received POST request on the path ${req.path}`);
});

export { router as signinRouter }; // rename router
