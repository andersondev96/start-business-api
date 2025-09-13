import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { FindUserByEntrepreneurController } from "@modules/entrepreneurs/infra/http/controllers/FindUserByEntrepreneurController";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

import { CreateUsersController } from "../controllers/CreateUsersController";
import { DeleteUserController } from "../controllers/DeleteUserController";
import { FindByUserIdController } from "../controllers/FindByUserIdController";
import { FindFavoriteController } from "../controllers/FindFavoriteController";
import { FindUserByEmailController } from "../controllers/FindUserByEmailController";
import { ListFavoritesController } from "../controllers/ListFavoritesController";
import { UpdateUserAvatarController } from "../controllers/UpdateUserAvatarController";
import { UpdateUserController } from "../controllers/UpdateUserController";

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string({ message: "Name is required" }).min(1, { message: "Name is required" }),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  isEntrepreneur: z.enum(["ADMIN", "ENTREPRENEUR", "CUSTOMER"]).default("CUSTOMER")
});

const createUserResponseSchema = z.object({
  user: userSchema,
  token: z.string().uuid()
});

const createUserController = new CreateUsersController();
const findUserByEmailController = new FindUserByEmailController();
const findByUserIdController = new FindByUserIdController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const findUserByEntrepreneurController = new FindUserByEntrepreneurController();
const listFavoritesController = new ListFavoritesController();
const findFavoriteController = new FindFavoriteController();

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", {
    schema: {
      summary: "Create User",
      tags: ["users"],
      body: z.object({
        name: z.string({ message: "Name is required" }).min(1, { message: "Name is required" }),
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
        isEntrepreneur: z.enum(["ADMIN", "ENTREPRENEUR", "CUSTOMER"]).default("CUSTOMER")
      }),
      response: {
        201: createUserResponseSchema
      }
    }
  }, createUserController.handle);

  app.get("/email", findUserByEmailController.handle);
  app.get("/profile", { onRequest: [ensureAuthenticated] }, findByUserIdController.handle);
  app.get("/entrepreneur", { onRequest: [ensureAuthenticated] }, findUserByEntrepreneurController.handle);
  app.get("/favorites", { onRequest: [ensureAuthenticated] }, listFavoritesController.handle);
  app.get("/favorite/:table_id", { onRequest: [ensureAuthenticated] }, findFavoriteController.handle);
  app.delete("/", { onRequest: [ensureAuthenticated] }, deleteUserController.handle);
  app.put("/", { onRequest: [ensureAuthenticated] }, updateUserController.handle);
  app.patch(
    "/avatar",
    { 
      onRequest: [ensureAuthenticated]
    },
    updateUserAvatarController.handle
  );
}

export default usersRoutes;
