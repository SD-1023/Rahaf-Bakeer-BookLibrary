import { Request, Response, NextFunction } from "express";
import { getCacheValue } from "../appCache";
import CUser from "../classes/userClass";

async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies["session_token"];

  if (!token) {
    return res.status(401).send("The session token is required");
  } else {
    const user = getCacheValue("User") as CUser;
    try {
      const sessionData = await user.checkSession(token);
      const dateNow = new Date();
      if (
        !sessionData ||
        dateNow.getDate() < new Date(sessionData.expirationDate).getDate()
      ) {
        return res.status(401).send("The session token is invalid");
      } else {
        req.params.user_id = sessionData.user_id.toString();
        next();
      }
    } catch (e: any) {
      return res.status(500);
    }
  }
}

export default { authenticateUser };
