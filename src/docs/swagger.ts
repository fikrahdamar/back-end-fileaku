import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "API For FileAku",
    description: "Documentation api for fileAku web application",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server",
    },
    {
      url: "https://back-end-fileaku.vercel.app/api",
      description: "Deploy server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        $identifier: "fikrahdamars",
        $password: "123456",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
