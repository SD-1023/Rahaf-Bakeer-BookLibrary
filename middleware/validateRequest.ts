import { object, string, number } from "yup";
import { Request, Response, NextFunction } from "express";

async function bookPostValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let bookSchema = object({
    body: object({
      title: string()
        .strict(true)
        .typeError("The Name Should be String")
        .nullable()
        .required("The Name is required"),
      isbn: number()
        .strict(true)
        .typeError("ISBN must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The ISBN is required"),

      publisher_id: number()
        .strict(true)
        .typeError("publisher id must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The publisher id is required"),
      year: number()
        .strict(true)
        .typeError("The year Should be number")
        .nullable(),

      author: string()
        .strict(true)
        .typeError("The Name Should be String")
        .nullable(),

      pages: number()
        .strict(true)
        .typeError("The pages number Should be number")
        .nullable(),
    })
      .required("The name,author,isbn are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await bookSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function publisherPostValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let publisherSchema = object({
    body: object({
      name: string()
        .strict(true)
        .typeError("The Name Should be String")
        .nullable()
        .required("The Name is required"),
      country: string()
        .strict(true)
        .typeError("The country Should be String")
        .nullable(),
    })
      .required("The name is required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await publisherSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function commentPostValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let commentSchema = object({
    body: object({
      name: string()
        .strict(true)
        .typeError("The Name Should be String")
        .nullable()
        .required("The Name is required"),
      comment: string()
        .strict(true)
        .typeError("The comment Should be String")
        .nullable()
        .required("The comment is required"),

      book_id: number()
        .strict(true)
        .typeError("The book id Should be number")
        .nullable()
        .required("The book id is required"),

      stars: number()
        .strict(true)
        .typeError("The stars number Should be number")
        .nullable(),
    })
      .required("The name,comment,book_id are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await commentSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateIDParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let bookISBNParamsSchema = object({
    params: object({
      id: number()
        .typeError("id must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The ID is required"),
    }).noUnknown(true),
  });

  try {
    const response = await bookISBNParamsSchema.validate({
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateNameQuery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let bookNameQuerySchema = object({
    query: object({
      name: string()
        .strict(true)
        .typeError("The Name Should be String")
        .nullable()
        .required("The Name is required"),
      sort: string()
        .oneOf(["asc", "desc"])
        .strict(true)
        .typeError("The Sort Type Should be String")
        .nullable(),
    }).noUnknown(true),
  });

  try {
    const response = await bookNameQuerySchema.validate({ query: req.query });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function bookPostUpdateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let bookSchema = object({
    body: object({
      title: string()
        .strict(true)
        .typeError("The Name Should be String")
        .nullable(),
      isbn: number()
        .strict(true)
        .typeError("ISBN must be a number")
        .integer("Please enter a valid number.")
        .nullable(),

      publisher_id: number()
        .strict(true)
        .typeError("publisher id must be a number")
        .integer("Please enter a valid number.")
        .nullable(),

      year: number()
        .strict(true)
        .typeError("The year Should be number")
        .nullable(),

      author: string()
        .strict(true)
        .typeError("The Name Should be String")
        .nullable(),

      pages: number()
        .strict(true)
        .typeError("The pages number Should be number")
        .nullable(),
    })
      .required("A Value Should be Inserted")
      .nullable()
      .strict(true)
      .noUnknown(true),

    params: object({
      id: number()
        .typeError("ID must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The ID is required"),
    }).noUnknown(true),
  });

  try {
    const response = await bookSchema.validate({
      body: req.body,
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function publisherPostUpdateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let publisherSchema = object({
    body: object({
      name: string()
        .strict(true)
        .typeError("The Name Should be String")
        .nullable(),

      country: string()
        .strict(true)
        .typeError("The country Should be String")
        .nullable(),
    })
      .required("A Value Should be Inserted")
      .nullable()
      .strict(true)
      .noUnknown(true),

    params: object({
      id: number()
        .typeError("ID must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The ID is required"),
    }).noUnknown(true),
  });

  try {
    const response = await publisherSchema.validate({
      body: req.body,
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function commentPostUpdateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let commentSchema = object({
    body: object({

      comment: string()
        .strict(true)
        .typeError("The comment Should be String")
        .nullable(),

      stars: number()
        .strict(true)
        .typeError("The stars number Should be number")
        .nullable(),
    })
      .required("A Value Should be Inserted")
      .nullable()
      .strict(true)
      .noUnknown(true),

    params: object({
      id: number()
        .typeError("ID must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The ID is required"),
    }).noUnknown(true),
  });

  try {
    const response = await commentSchema.validate({
      body: req.body,
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

export default {
  bookPostValidation,
  validateIDParams,
  validateNameQuery,
  bookPostUpdateValidation,
  publisherPostValidation,
  publisherPostUpdateValidation,
  commentPostValidation,
  commentPostUpdateValidation,
};
