import { WebApp } from "meteor/webapp"
import fs from "fs"
import path from "path"
import readline from "readline"

// console.log("assets absoluteFilePath", filePath);
// console.log("process.env.PWD ", process.env.PWD);
// console.log("process.env ", process.env);

const description = "The Stanley Parabaley dialog remixé avec animals crossing."

WebApp.connectHandlers.use("/api/hello", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // Allow all origins (use specific domains for more security)
  res.setHeader("Content-Type", "text/plain")

  res.write(description)
  res.end()
})
