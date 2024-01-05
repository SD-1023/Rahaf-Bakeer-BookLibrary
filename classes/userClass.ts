import DBAction from "../interfaces/classInterface";
import {
  IUser,
  IComment,
  IPublisher,
  IBook,
} from "../interfaces/objInterfaces";
import Book from "../models/Book";
import { appCache, getCacheValue } from "../appCache";
import Publisher from "../models/publisher";
import Comment from "../models/Comment";
import { Sequelize } from "sequelize-typescript";
import { Op, where } from "sequelize";
import User from "../models/User";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Session from "../models/Session";
import emailOPT from "../emailOPT";

export default class CUser {
  async generateOrUpdateSession(userId: number): Promise<[string, string]> {
    const token = uuidv4();
    const expirationDate = new Date().setMonth(new Date().getMonth() + 1);
    try {
      const data = await Session.create({
        token: token,
        expirationDate: expirationDate,
        user_id: userId,
      });
      return [data.token, data.expirationDate];
    } catch (e: any) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return await this.generateOrUpdateSession(userId);
      } else {
        throw new Error(e.message);
      }
    }
  }

  async checkSession(token: string): Promise<Session> {
    const data = await Session.findOne({
      where: {
        token: token,
      },
    });

    return data;
  }
  async createAccount(data: IUser): Promise<[IUser, string, string]> {
    try {
      const dataAdded = await User.create(data);
      let dataToReturn = dataAdded.toJSON();
      delete dataToReturn.password;
      try {
        const [token, expirationDate] = await this.generateOrUpdateSession(
          dataToReturn.user_id
        );
        return [dataToReturn, token, expirationDate];
      } catch (e: any) {
        if (e.name === "SequelizeUniqueConstraintError") {
          await this.generateOrUpdateSession(data.user_id);
        }
      }
    } catch (e: any) {
      if (
        e.name === "SequelizeValidationError" ||
        e.name === "SequelizeUniqueConstraintError"
      ) {
        throw new Error(e?.errors[0]?.message, { cause: "Validation error" });
      } else {
        throw new Error(e);
      }
    }
  }

  async checkUserExists(key: string, value: string | number): Promise<IUser> {
    try {
      let userData = await User.findOne({
        where: {
          [key as keyof IUser]: value,
        },
      });
      if (!userData) {
        throw new Error("Invalid Data Try Again", {
          cause: "Validation Error",
        });
      }
      return userData.toJSON();
    } catch (e: any) {
      if (e.cause === "Validation Error") {
        throw new Error("Invalid Data Try Again", {
          cause: "Validation Error",
        });
      } else throw new Error(e);
    }
  }

  async logInUser(user: Partial<IUser>): Promise<[IUser, string, string]> {
    try {
      const userData = await this.checkUserExists("email", user.email);
      if (userData) {
        try {
          const validate = await bcrypt.compare(
            user.password,
            userData.password
          );
          if (validate) {
            delete userData.password;
            const [token, expirationDate] = await this.generateOrUpdateSession(
              userData.user_id
            );
            return [userData, token, expirationDate];
          } else {
            throw new Error("Invalid Data Try Again", {
              cause: "Validation Error",
            });
          }
        } catch (e: any) {
          if (e.cause === "Validation Error") {
            throw new Error(e.message, {
              cause: "Validation Error",
            });
          } else throw new Error(e);
        }
      }
    } catch (e: any) {
      if (e.cause === "Validation Error") {
        throw new Error(e.message, {
          cause: "Validation Error",
        });
      } else throw new Error(e);
    }
  }

  async clearSession(user_id: number) {
    try {
      const deleteSession = await Session.destroy({
        where: {
          user_id: user_id,
        },
      });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async changePassword(passwords: any, user_id: number) {
    try {
      const userData = await this.checkUserExists("user_id", user_id);
      if (userData) {
        try {
          const validate = await bcrypt.compare(
            passwords.oldPassword,
            userData.password
          );

          if (validate && passwords.newPassword === passwords.confirmPassword) {
            const salt = bcrypt.genSaltSync(10);
            const updatedPassword = bcrypt.hashSync(
              passwords.newPassword,
              salt
            );
            try {
              const updatedData = await User.update(
                { password: updatedPassword },
                {
                  where: {
                    user_id: user_id,
                  },
                }
              );
              await this.clearSession(user_id);
            } catch (e: any) {
              throw new Error(e.message);
            }
          } else {
            throw new Error(
              validate
                ? "NewPass and the confirm pass are not the same"
                : "Invalid password",
              {
                cause: "Validation Error",
              }
            );
          }
        } catch (e: any) {
          if (e.cause === "Validation Error") {
            throw new Error(e.message, {
              cause: "Validation Error",
            });
          } else throw new Error(e);
        }
      }
    } catch (e: any) {
      if (e.cause === "Validation Error") {
        throw new Error(e.message, {
          cause: "Validation Error",
        });
      } else throw new Error(e);
    }
  }

  async sendOPTCode(data: any) {
    try {
      let user = await User.findOne({ where: { email: data.email } });
      user = user?.toJSON();
      if (user) {
        const randomOPT = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        const updatedData = await User.update(
          { optCode: randomOPT },
          {
            where: {
              user_id: user.user_id,
            },
          }
        );

        emailOPT.emailOptions.to = user.email;
        emailOPT.emailOptions.subject = "OPT CODE";
        emailOPT.emailOptions.text = "Your OPT CODE is " + randomOPT.toString();
        emailOPT.transporter.sendMail(
          emailOPT.emailOptions,
          function (error, info) {
            if (error) {
              throw new Error(error.message);
            }
          }
        );
      } else {
        throw new Error("The Email not found", {
          cause: "NOT FOUND",
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async validateOPTCode(data: Partial<IUser>): Promise<boolean> {
    try {
      let user = await User.findOne({ where: { email: data.email } });
      user = user?.toJSON();
      if (user) {
        if (user.optCode === data.optCode) {
          const updatedData = await User.update(
            { optCode: null },
            {
              where: {
                email: data.email,
              },
            }
          );
          return true;
        }
      }
      return false;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async forgetPassword(data: any) {
    if (data.password === data.confirmPassword) {
      const salt = bcrypt.genSaltSync(10);
      const updatedPassword = bcrypt.hashSync(data.password, salt);
      try {
        const updatedData = await User.update(
          { password: updatedPassword },
          {
            where: {
              email: data.email,
            },
          }
        );
      } catch (e: any) {
        throw new Error(e.message);
      }
    } else {
      throw new Error(
        "NewPass and the confirm pass are not the same",

        {
          cause: "Validation Error",
        }
      );
    }
  }
}
