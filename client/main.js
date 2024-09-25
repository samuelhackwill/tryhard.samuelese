import { Template } from "meteor/templating"
import { ReactiveVar } from "meteor/reactive-var"

import "../imports/bulle.js"

import "./main.html"

// Global reactive data store

export const GlobalEvents = {
  START_WRITING: "START_WRITING",
  END_OF_PARAGRAPH: "END_OF_PARAGRAPH",
  RESTART: "RESTART",
}

export const GlobalEvent = new ReactiveVar(null)

// [.,?\/#!$%\^&\*;:{}=\-_`~()]
