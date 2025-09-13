import type { FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { CreateUserService } from "@modules/users/services/CreateUserService";
import { AppError } from "@shared/errors/AppError";

export class CreateUsersController {
  async handle(request: FastifyRequest, response: FastifyReply): Promise<FastifyReply> {

    const createUserBodySchema = z.object({
      name: z.string({ message: "Name is required" }).min(1, { message: "Name is required" }),
      email: z.string().email("Invalid email format"),
      password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
      isEntrepreneur: z.boolean().default(false)
    });

    const { name, email, password, isEntrepreneur } = createUserBodySchema.parse(request.body);

    try {
      const createUserService = container.resolve(CreateUserService);

      const user = await createUserService.execute({
        name,
        email,
        password,
        isEntrepreneur
      });

    return response.status(201).send(user);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).send({
          status: "error",
          message: error.message
        });
      }

      return response.status(500).send({
        status: "error",
        message: "Internal server error"
      });
    }
  }
}
