import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import reqValidation from "../middleware/validateRequest";
import CBook from "../classes/bookClass";
import { appCache, getCacheValue } from "../appCache";
import cookieParser from "cookie-parser";
import authentication from "../middleware/authentication";
const router = Router();

router.use(cookieParser());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get(
  "/top-rated",
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.getRatedEntities();
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.get(
  "/:id",
  reqValidation.validateIDParams,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.getEntityByID(Number(req.params.id));
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  try {
    const book = getCacheValue("Book") as CBook;
    const dataInfo = await book?.getEntities();
    res.status(200).send(dataInfo);
  } catch (e: any) {
    res.status(500).send();
  }
});


router.post(
  "/rentBook/:id",
  reqValidation.rentBookPostValidation,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.rentBook(Number(req.params.id),Number(req.params.user_id),req.body);
      res.status(200).send(dataInfo);
    } catch (e: any) {
    
        res.status(500).send();
    
    }
  }
);


router.post(
  "/",
  reqValidation.bookPostValidation,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.addEntities(req.body,Number(req.params.user_id));
      res.status(200).send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "unique violation") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);





router.patch(
  "/:id",
  reqValidation.bookPostUpdateValidation,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.updateEntities(
        req.body,
        "book_id",
        req.params.id
      );
      res.status(200).send(dataInfo);
    } catch (e: any) {
      if (e?.cause == "unique violation") {
        res.status(400).send(e.message);
      } else {
        res.status(500).send();
      }
    }
  }
);

router.delete(
  "/:id",
  reqValidation.validateIDParams,
  authentication.authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.deleteEntities(req.params.id);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

export default router;
