import "reflect-metadata";
import "dotenv/config";
import express, { Response } from "express";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers";
import { createConnections } from "typeorm";
// import { User } from "./entity/User";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.use(cors());

  await createConnections();

  app.get("/", (_req, res: Response, _next) =>
    res.send("Hola Fuanca vamos a coronar con fuerza y dedicacion")
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`App running on port http://localhost:4000`);
    console.log(`GraphQL running on port http://localhost:4000/graphql`);
  });
})();
