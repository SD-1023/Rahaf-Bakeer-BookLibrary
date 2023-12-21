import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
// import services from "./services";
import reqValidation from "../middleware/validateRequest";
import CBook from "../classes/bookClass";
import { IBook } from "../interfaces/objInterfaces";
import { appCache, getCacheValue } from "../appCache";
const router = Router();

appCache.set("Book", new CBook());

router.get(
  "/books/:id",
  reqValidation.validateIDParams,
  async (req: Request, res: Response) => {
    const book = getCacheValue("Book") as CBook;
    const dataInfo = await book?.getEntityByID(Number(req.params.id));
    res.status(200).send(dataInfo);
  }
);

router.get("/books", async (req: Request, res: Response) => {
  const book = getCacheValue("Book") as CBook;
  const dataInfo = await book?.getEntities();
  res.status(200).send(dataInfo);
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post(
  "/books",
  reqValidation.bookPostValidation,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.addEntities(req.body);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send();
    }
  }
);

router.patch(
  "/books/:id",
  reqValidation.bookPostUpdateValidation,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.updateEntities(
        req.body,
        "book_id",
        req.params.id
      );
      res.status(200).send(dataInfo.toString());
    } catch (e: any) {
      res.status(500).send();
    }
  }
);


router.delete(
  "/books/:id",
  reqValidation.validateIDParams,
  async (req: Request, res: Response) => {
    try {
      const book = getCacheValue("Book") as CBook;
      const dataInfo = await book?.deleteEntities("book_id", req.params.id);
      res.status(200).send(dataInfo);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }
);

export default router;
