import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import reqValidation from "../middleware/validateRequest";
import { appCache, getCacheValue } from "../appCache";
import CUser from "../classes/userClass";
import cookieParser from "cookie-parser";
import authentication from "../middleware/authentication";
import validateRequest from "../middleware/validateRequest";
const router = Router();

router.use(cookieParser());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post(
  "/create-account",
  reqValidation.UserPostValidation,
  async (req: Request, res: Response) => {
    try {
      const user = getCacheValue("User") as CUser;
      const [dataInfo, token, expirationDate] = await user?.createAccount(
        req.body
      );
      res
        .status(200)
        .cookie("session_token", token, { expires: new Date(expirationDate) })
        .send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "Validation error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);

router.post(
  "/login",
  validateRequest.UserLoginValidation,
  async (req: Request, res: Response) => {
    try {
      const user = getCacheValue("User") as CUser;
      const [dataInfo, token, expirationDate] = await user?.logInUser(req.body);
      res
        .status(200)
        .cookie("session_token", token, { expires: new Date(expirationDate) })
        .send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "Validation Error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);

router.post(
  "/logout",
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = getCacheValue("User") as CUser;
      const dataInfo = await user?.clearSession(Number(req.params.user_id));
      res.status(200).send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "Validation Error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);


router.post(
    "/send-optCode",
    validateRequest.emailValidation,
    async (req: Request, res: Response) => {
      try {
        const user = getCacheValue("User") as CUser;
      await user?.sendOPTCode(req.body);
        res.status(200).end();
      } catch (e: any) {
        if (e?.cause == "Validation Error") {
          res.status(400).send(e.message);
        } else {
          res.status(500).send();
        }
      }
    }
  );



  router.post(
    "/validate-optCode",
    validateRequest.OPTCodeValidation,
    async (req: Request, res: Response) => {
      try {
        const user = getCacheValue("User") as CUser;
        const dataInfo = await user?.validateOPTCode(req.body);
        res.status(200).send(dataInfo);
      } catch (e: any) {
        if (e?.cause == "Validation Error") {
          res.status(400).send(e.message);
        } else {
          res.status(500).send();
        }
      }
    }
  );



router.patch(
  "/change-password",
  validateRequest.changePasswordValidation,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = getCacheValue("User") as CUser;
      const dataInfo = await user?.changePassword(
        req.body,
        Number(req.params.user_id)
      );
      res.status(200).cookie("session_token",dataInfo).send();
    } catch (e: any) {
      if (e?.cause == "Validation Error") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);



router.patch(
    "/forget-password",
    validateRequest.forgetPassValidation,
    async (req: Request, res: Response) => {
      try {
        const user = getCacheValue("User") as CUser;
          await user?.forgetPassword(
          req.body,
        );
        res.status(200).end();
      } catch (e: any) {
        if (e?.cause == "Validation Error") {
          res.status(400).send(e.message);
        } else {
          res.status(500).send();
        }
      }
    }
  );


  
export default router;
