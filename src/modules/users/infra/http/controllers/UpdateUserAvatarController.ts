import { FastifyRequest, FastifyReply } from "fastify";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { container } from "tsyringe";
import { z } from "zod";

import { UpdateUserAvatarService } from "@modules/users/services/UpdateUserAvatarService";

export class UpdateUserAvatarController {

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const updateUserAvatarParamsSchema = z.object({
      id: z.string().uuid()
    });
    
    const { id } = updateUserAvatarParamsSchema.parse(request.params);

    const parts = request.parts();

    let avatarFile;

    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "avatar") {
        const fileName = `${Date.now()}-${part.filename}`;
        const filePath = resolve(__dirname, "..", "..", "..", "tmp", fileName);

        const writeStream = createWriteStream(filePath);
        await part.file.pipe(writeStream);

        avatarFile = fileName;
        break;
      }
    }

    if (!avatarFile) {
      return reply.status(400).send({ message: "Avatar file is missing" });
    }

    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    await updateUserAvatarService.execute({ 
      user_id: id, 
      avatar_url: avatarFile 
    });

    return reply.status(204).send();
  }
}