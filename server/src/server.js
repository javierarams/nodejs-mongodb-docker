// import { MongoClient } from 'mongodb';
import Fastify from "fastify";
import dbConnector from "./db-connector.js";
import propertyRoutes from "./property-routes.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(dbConnector);
fastify.register(propertyRoutes);

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

async function main() {
  try {
    const start = async () => {
      try {
        await fastify.listen({ port: SERVER_PORT, host: SERVER_HOST });
      } catch (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    };
    start();
  } catch (err) {
    console.log("Something went wrong", err);
  }
}

main()
  .then(() => console.log("Server started!"))
  .catch((err) => console.log("Something went wrong", err));
