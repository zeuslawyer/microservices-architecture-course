import express from "express"
import bodyParser from "body-parser"

import { currentUserRouter } from "./routes/currentUser"
import { signinRouter } from "./routes/signin"
import { signoutRouter } from "./routes/signout"
import { signupRouter } from "./routes/signup"
import { errorHandler } from "./middleware/errorHandler"

const PORT = 3010
const app = express()
app.use(bodyParser.json())
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.use(errorHandler) // goes last

app.get("/test-path", (req, res) => {
  res.json({})
})

app.listen(PORT, () => {
  console.info("Auth Service Listening On Port", PORT)
})
