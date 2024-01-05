import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import reqValidation from "../middleware/validateRequest";
import { appCache, getCacheValue } from "../appCache";
import CComment from "../classes/commentClass";
import cookieParser from "cookie-parser";
import authentication from "../middleware/authentication";
const router = Router();

router.use(cookieParser());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get(
  "/:id",
  reqValidation.validateIDParams,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const comment = getCacheValue("Comment") as CComment;
      const dataInfo = await comment?.getEntityByID(Number(req.params.id));
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.get(
  "/",
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const comment = getCacheValue("Comment") as CComment;
      const dataInfo = await comment?.getEntities();
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.post(
  "/",
  reqValidation.commentPostValidation,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const comment = getCacheValue("Comment") as CComment;
      const dataInfo = await comment?.addEntities(req.body);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.patch(
  "/:id",
  reqValidation.commentPostUpdateValidation,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const comment = getCacheValue("Comment") as CComment;
      const dataInfo = await comment?.updateEntities(
        req.body,
        "comment_id",
        req.params.id
      );
      res.status(200).send(dataInfo.toString());
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.delete(
  "/:id",
  reqValidation.validateIDParams,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const comment = getCacheValue("Comment") as CComment;
      const dataInfo = await comment?.deleteEntities(req.params.id);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

export default router;
