import "./bulle.html"

import { Template } from "meteor/templating"
import { ReactiveVar } from "meteor/reactive-var"
import { textArr } from "../textArr.js"

import "../imports/lettreur.js"

import { GlobalEvents } from "../client/main.js"
import { GlobalEvent } from "../client/main.js"

const States = {
  INITIAL: "INITIAL",
  OPENING: "OPENING",
  OPEN: "OPEN",
  // WRITING: "WRITING",
  // COMPLETE: "COMPLETE",
  CLOSING: "CLOSING",
  CLOSED: "CLOSED",
  FINISHED: "FINISHED",
}

const Events = {
  CLICK: "CLICK",
  BOX_ANIMATION_FINISHED: "ANIMATION_BOX_FINISHED",
  EVENT_LISTENER_ADDED: "EVENT_LISTENER_ADDED",
  TEXT_ANIMATION_FINISHED: "TEXT_ANIMATION_FINISHED",
}

Template.bulle.onCreated(function helloOnCreated() {
  this.paragraphIndex = new ReactiveVar(0)
  this.sentenceIndex = new ReactiveVar(0)
  this.currentState = new ReactiveVar(States.INITIAL)
  this.nextPhrase = new ReactiveVar("")
  this.text = new ReactiveVar("")

  // the transition function won't work without a global. for some reason it can't *always* access the Template.instance(). Prob when getting called from an arrow function for some reason.
  // ah et puis en fait LOOK MOM NO GLOBAL
  // instance = Template.instance();
})

Template.bulle.onRendered(function () {
  onEnterInitial(this)

  this.autorun(() => {
    console.log("bulle RE-RENDERING, global event : ", GlobalEvent.get())

    if (!GlobalEvent.get()) {
      return
    } else {
      if (GlobalEvent.get() == GlobalEvents.END_OF_PARAGRAPH) {
        // Respond to state changes in prout2
        transition(GlobalEvents.END_OF_PARAGRAPH, this)
      }
    }
  })
})

Template.bulle.helpers({
  openOrClosed() {
    const state = Template.instance().currentState.get()
    if (state == "FINISHED" || state == "INITIAL" || state == "CLOSING" || state == "CLOSED") {
      return "opacity-0"
    } else {
      return "opacity-1"
    }
  },
  state() {
    return Template.instance().currentState.get()
  },
})

Template.bulle.events({
  "click #bulleContainer"(event, instance) {
    transition("CLICK", instance)
  },
})

const transition = function (event, facultativeContext) {
  let instance = null
  // console.log("bulle transition!", event, facultativeContext)

  // on est ammenés à appeler cette fonction depuis des contextes différents, et dans certains cas on a pas accès à Template.instance() donc il faut le récupérer dans les arguments de la fonction t'as vu
  if (facultativeContext) {
    instance = facultativeContext
  } else {
    instance = Template.instance()
  }

  switch (instance.currentState.get()) {
    case "INITIAL":
      if (event === Events.CLICK) {
        instance.currentState.set(States.OPENING)
        // onEnterOpening(instance)
      }
      break

    case "OPENING":
      if (event === Events.BOX_ANIMATION_FINISHED) {
        instance.currentState.set(States.OPEN)
        onEnterOpen(instance)
      }
      break

    case "OPEN":
      if (event === GlobalEvents.END_OF_PARAGRAPH) {
        onEnterClosing(instance)
        instance.currentState.set(States.CLOSING)
        // instance.GlobalEvent.set(GlobalEvents.START_WRITING)
      }

      break

    case "CLOSING":
      if (event === Events.BOX_ANIMATION_FINISHED) {
        instance.currentState.set(States.CLOSED)
        onEnterClosed(instance)
      }
      break

    case "CLOSED":
      if (event === Events.CLICK) {
        parX = instance.paragraphIndex.get()
        if (parX > textArr.acte1.length - 1) {
          instance.currentState.set(States.FINISHED)
          onEnterFinished(instance)
        } else {
          instance.currentState.set(States.OPENING)
          onEnterOpening(instance)
        }
      }
      break

    case "FINISHED":
      if (event === Events.CLICK) {
        alert("Text is finished mate. You can restart if you want")
        instance.currentState.set(States.INITIAL)
        onEnterInitial(instance)
        GlobalEvent.set(GlobalEvents.RESTART)
      }
      break
  }
}

const onEnterOpening = function (instance) {
  // parX = instance.paragraphIndex.get()
  // sentX = instance.sentenceIndex.get()
  // instance.nextPhrase.set(textArr.acte1[parX][sentX])
}

const onEnterInitial = function (instance) {
  parX = instance.paragraphIndex.set(0)
  sentX = instance.sentenceIndex.set(0)

  element = document.getElementById("bulle")
  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED, instance)
  }
}

const onEnterClosing = function (instance) {
  console.log("SETTING UP EVENT LISTENTER")
  element = document.getElementById("bulle")

  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED, instance)
  }

  transition(Events.EVENT_LISTENER_ADDED, instance)

  GlobalEvent.set(null)
}

const onEnterClosed = function (instance) {
  element = document.getElementById("bulle")
  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED, instance)
  }

  instance.text.set("")

  parX = instance.paragraphIndex.get() + 1

  instance.sentenceIndex.set(0)

  instance.paragraphIndex.set(parX)
}

const onEnterOpen = function (instance) {
  GlobalEvent.set(GlobalEvents.START_WRITING)

  // instance.sentenceIndex.set(instance.sentenceIndex.get() + 1)

  // sentX = instance.paragraphIndex.get()
  // parX = instance.sentenceIndex.get()
  // instance.nextPhrase.set(textArr.acte1[sentX][parX])

  // instance.text.set("")

  // transition(Events.END_OF_PARAGRAPH, instance)
}

const onEnterFinished = function (instance) {
  console.log("waiting for click")
}
