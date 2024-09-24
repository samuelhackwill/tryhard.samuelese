import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import { textArr } from "./textArr.js";
import { Meteor } from "meteor/meteor";

import "./main.html";

// [.,?\/#!$%\^&\*;:{}=\-_`~()]

const States = {
  INITIAL: "INITIAL",
  OPENING: "OPENING",
  OPEN: "OPEN",
  WRITING: "WRITING",
  COMPLETE: "COMPLETE",
  CLOSING: "CLOSING",
  CLOSED: "CLOSED",
  FINISHED: "FINISHED",
};

const Events = {
  CLICK: "CLICK",
  BOX_ANIMATION_FINISHED: "ANIMATION_BOX_FINISHED",
  END_OF_SENTENCE: "END_OF_SENTENCE",
  TEXT_ANIMATION_FINISHED: "TEXT_ANIMATION_FINISHED",
  END_OF_PARAGRAPH: "END_OF_PARAGRAPH",
};

Template.bulle.onCreated(function helloOnCreated() {
  this.paragraphIndex = new ReactiveVar(0);
  this.sentenceIndex = new ReactiveVar(0);
  this.currentState = new ReactiveVar(States.INITIAL);

  instance = Template.instance();
});

Template.bulle.onRendered(function () {
  element = document.getElementById("bulle");
  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED);
  };
});

Template.bulle.helpers({
  openOrClosed() {
    _ = Template.instance().currentState.get();
    console.log("state:", _);
    if (_ == "FINISHED" || _ == "INITIAL" || _ == "CLOSED") {
      return "opacity-0";
    } else {
      return "opacity-1";
    }
  },
  text() {
    sentX = Template.instance().paragraphIndex.get();
    parX = Template.instance().sentenceIndex.get();

    return textArr.acte1[sentX][parX];
  },

  state() {
    return Template.instance().currentState.get();
  },
});

Template.bulle.events({
  "click #bulleContainer"(event, instance) {
    transition("CLICK");
  },
});

// openBulle = function (instance) {
//   if (instance.open.get() === false) {
//     instance.open.set(true);
//   } else {
//     instance.open.set(false);
//   }
// };

function transition(event) {
  switch (instance.currentState.get()) {
    case "INITIAL":
      if (event === Events.CLICK) {
        instance.currentState.set(States.OPENING);
        onEnterOpening();
      }
      break;

    case "OPENING":
      if (event === Events.BOX_ANIMATION_FINISHED) {
        instance.currentState.set(States.OPEN);
        onEnterOpen();
      }
      break;
  }
}

onEnterOpening = function () {
  // console.log("prout");
};

onEnterOpen = function () {
  // console.log("waiting further orders");
};
