import { object, string, number, date } from "yup";
import { Request, Response, NextFunction } from "express";
import { parse } from "date-fns";

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


        quantity: number()
        .strict(true)
        .typeError("The quantity Should be number")
        .nullable() 
        .required("The quantity  required"),
    })
      .required("The name,author,isbn,quantity are required")
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
  let IDParamsSchema = object({
    params: object({
      id: number()
        .typeError("id must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The ID is required"),
    }).noUnknown(true),
  });

  try {
    const response = await IDParamsSchema.validate({
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
   
        quantity: number()
        .strict(true)
        .typeError("The quantity Should be number")
        .nullable() ,
     
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










async function rentBookPostValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let bookSchema = object({
    body: object({
     
   
      copies_number: number()
        .strict(true)
        .typeError("The copies number Should be number")
        .nullable().required(),

     
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

async function UserPostValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      first_name: string()
        .strict(true)
        .typeError("The First Name Should be String")
        .nullable()
        .required("The First Name is required"),

      last_name: string()
        .strict(true)
        .typeError("The Last Name Should be String")
        .nullable()
        .required("The Last Name is required"),

      DOB: string()
        .strict(true)
        .typeError("date must be a string formate")
        .nullable()
        .required("The date is required")
        .test("max", "the date is in the future", function (value) {
          return Number(value.split("-")[0]) < new Date().getFullYear();
        })
        .matches(
          /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/,
          "Date must be in format yyyy-MM-dd"
        ),
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      password: string()
        .strict(true)
        .required("The password is required")
        .typeError("The password Should be String")
        .min(6, 'password should not be less than 6 digits')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
          "The password must contain characters,numbers and special characters"
        )
        .nullable(),
    })
      .required("The first name,last name,email,DOB,password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await userSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function UserLoginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      password: string()
        .strict(true)
        .required("The password is required")
        .typeError("The password Should be String")
        .nullable(),
    })
      .required("The email,password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await userSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function changePasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      oldPassword: string()
        .strict(true)
        .typeError("The old Password Should be String")
        .nullable()
        .required("The old Password is required"),

      newPassword: string()
        .strict(true)
        .typeError("The new Password Should be String")
        .nullable()
        .min(6, 'password should not be less than 6 digits')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
        "The password must contain characters,numbers and special characters"
      )
        .required("The new Password is required"),

      confirmPassword: string()
        .strict(true)
        .typeError("The confirm Password Should be String")
        .nullable()
        .min(6, 'password should not be less than 6 digits')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
        "The password must contain characters,numbers and special characters"
      )
        .required("The confirm Password  is required"),
    })
      .required("The old ,new and confirm Passwords are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await userSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateUserIDParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let IDParamsSchema = object({
    params: object({
      user_id: number()
        .typeError("id must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The ID is required"),
    }).noUnknown(true),
  });

  try {
    const response = await IDParamsSchema.validate({
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}




async function emailValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

     
    })
      .required("The email,password,confirm Password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await userSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}






async function OPTCodeValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      optCode: number()
        .strict(true)
        .required("The opt code is required")
        .typeError("The opt code Should be number") 
        .nullable(),

       
    })
      .required("The email,opt code,  are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await userSchema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}


async function forgetPassValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userSchema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      password: string()
        .strict(true)
        .required("The password is required")
        .typeError("The password Should be String") 
        .min(6, 'password should not be less than 6 digits')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
        "The password must contain characters,numbers and special characters"
      )
        .nullable(),

        confirmPassword: string()
        .strict(true)
        .required("The confirm Password is required")
        .typeError("The confirm Password Should be String")
        .min(6, 'password should not be less than 6 digits')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
        "The password must contain characters,numbers and special characters"
      )
        .nullable(),
    })
      .required("The email,password,confirm Password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await userSchema.validate({ body: req.body });
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
  UserPostValidation,
  UserLoginValidation,
  validateUserIDParams,
  changePasswordValidation,
  emailValidation,
  OPTCodeValidation,
  forgetPassValidation,
  rentBookPostValidation
};
