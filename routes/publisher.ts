import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import reqValidation from "../middleware/validateRequest";
import { appCache, getCacheValue } from "../appCache";
import CPublisher from "../classes/publisherClass";
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
      const publisher = getCacheValue("Publisher") as CPublisher;
      const dataInfo = await publisher?.getEntityByID(Number(req.params.id));
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.get(
  "/:id/books",
  reqValidation.validateIDParams,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const publisher = getCacheValue("Publisher") as CPublisher;
      const dataInfo = await publisher?.getOtherEntity(Number(req.params.id));
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
      const publisher = getCacheValue("Publisher") as CPublisher;
      const dataInfo = await publisher?.getEntities();
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.post(
  "/",
  reqValidation.publisherPostValidation,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const publisher = getCacheValue("Publisher") as CPublisher;
      const dataInfo = await publisher?.addEntities(req.body);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.patch(
  "/:id",
  reqValidation.publisherPostUpdateValidation,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const publisher = getCacheValue("Publisher") as CPublisher;
      const dataInfo = await publisher?.updateEntities(
        req.body,
        "publisher_id",
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
      const publisher = getCacheValue("Publisher") as CPublisher;
      const dataInfo = await publisher?.deleteEntities(req.params.id);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

export default router;
