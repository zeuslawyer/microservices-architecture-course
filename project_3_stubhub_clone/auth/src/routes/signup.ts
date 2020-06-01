import express, { Request, Response } from 'express';
import { body } from 'express-validator';
const router = express.Router();

// middleware array
const validation = [body('email').isEmail().withMessage('Email must be valid')];

router.post('/api/users/signup', validation, (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.send(`Sign up service received GET request on the path ${req.path}`);
});

export { router as signupRouter }; // rename router
