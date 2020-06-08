import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// extend the current type definition of the Request object to include the payload
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const setCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.session!.jwt) {
    try {
      const payload = jwt.verify(req.session!.jwt, process.env.JWT_KEY!) as UserPayload;
      req.currentUser = payload;
      next();
    } catch (e) {
      console.info("No user session available: ", e.message);
      next();
    }
  } else {
    return next();
  }
};
