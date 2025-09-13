import "fastify";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface FastifyRequest {
    user: {
      id: string;
    };
  }
}