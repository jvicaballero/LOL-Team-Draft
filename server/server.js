import express from "express";
import path from "path";
import favicon from "serve-favicon";
import dotenv from "dotenv";
import championsRouter from "./routes/champions.js";
import teamsRouter from "./routes/teams.js";
// import the router from your routes file

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// What middleware actually is:

// Middleware is just a function that runs on every request before it reaches your route handler. Think of it as a checkpoint — the request goes through each middleware in order, then finally hits your route.
// In this case, express.json(), favIcon()..., express.static()
// are middlewares

// In this case: express.json() intercepts every request, checks if the Content-Type is application/json, and if so converts that raw string into a real JavaScript object — so by the time your route handler runs, req.body is already usable.
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(favicon(path.resolve("../", "client", "public", "lightning.png")));
} else if (process.env.NODE_ENV === "production") {
  app.use(favicon(path.resolve("public", "lightning.png")));
  app.use(express.static("public"));
}

// specify the api path for the server to use
app.use("/api/", championsRouter);
app.use("/api/", teamsRouter);

if (process.env.NODE_ENV === "production") {
  app.get("/*", (_, res) => res.sendFile(path.resolve("public", "index.html")));
}

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
