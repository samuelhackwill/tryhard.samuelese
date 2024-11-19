import { Template } from "meteor/templating"
import { ReactiveVar } from "meteor/reactive-var"

import "../imports/bulle.js"

import "./main.html"

let hasFirstPointerAppeared = false

// Global reactive data store

export const GlobalEvents = {
  START_WRITING: "START_WRITING",
  END_OF_PARAGRAPH: "END_OF_PARAGRAPH",
  RESTART: "RESTART",
}

export const GlobalEvent = new ReactiveVar(null)

// [.,?\/#!$%\^&\*;:{}=\-_`~()]

addPointer = function (id) {
  if (hasFirstPointerAppeared) {
    return
  } else {
    const newDiv = document.createElement("div")

    newDiv.classList.add("w-4", "h-6", "absolute", "left-[50%]", "top-[50%]")
    newDiv.style.transform = "translate(-50%,-50%) scale3d(900,900,1)"
    newDiv.style.backgroundImage = 'url("/cursor.png")'
    newDiv.style.backgroundSize = "cover"
    newDiv.style.backgroundPosition = "center"
    newDiv.style.backgroundRepeat = "no-repeat"
    newDiv.style.transition = "transform 1s"

    newDiv.id = "masterPointer"

    document.body.appendChild(newDiv)

    Meteor.setTimeout(function () {
      document.getElementById("masterPointer").style.transform = "translate(-50%,-50%) scale3d(1,1,1)"
    }, 50)
  }
}
