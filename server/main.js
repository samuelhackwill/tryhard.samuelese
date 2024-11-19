import { WebApp } from "meteor/webapp"
import path from "path"
import readline from "readline"

import "./parser.js"

// console.log("assets absoluteFilePath", filePath);
// console.log("process.env.PWD ", process.env.PWD);
// console.log("process.env ", process.env);

const description = "Sorte de dialogue où on essaie de donner de l'expressivité au texte. Players vs Samuel-le-narrateur"

WebApp.connectHandlers.use("/api/hello", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // Allow all origins (use specific domains for more security)
  res.setHeader("Content-Type", "text/plain")

  res.write(description)
  res.end()
})

Meteor.startup(async () => {
  const parsedContent = parseMarkdown(Assets.absoluteFilePath("text.md"))
  console.log(parsedContent)
})
