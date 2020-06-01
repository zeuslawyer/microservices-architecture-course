import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
const router = express.Router()

import { RequestValidationError } from "../Errors/RequestValidationError"
import { DatabaseConnectionError } from "../Errors/DatabaseConnectionError"

// middleware validation array of funcs
const validation = [
  body("email").isEmail().withMessage("Email must be valid."),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Please enter a valid password between 4 and 20 characters long."
    )
]

router.post("/api/users/signup", validation, (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array())
  }

  const { email, password } = req.body

  throw new DatabaseConnectionError()
  res.send(
    `Sign up service received POST request on the path ${req.path} from ${email}`
  )
})

export { router as signupRouter } // rename router
