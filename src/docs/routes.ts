import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json";
import fs from "fs";
import path from "path";

export default function docs(app: Express) {
  const css = fs.readFileSync(
    path.resolve(
      __dirname,
      "../../node_modules/swagger-ui-dist/swagger-ui.css"
    ),
    "utf-8"
  );

  const options = {
    customCss: css,
  };

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
  );
}
