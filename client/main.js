import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import { textArr } from "./textArr.js";

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
  this.nextPhrase = new ReactiveVar();
  this.text = new ReactiveVar("");

  // the transition function won't work without a global. for some reason it can't *always* access the Template.instance(). Prob when getting called from an arrow function for some reason.
  // LOOK MOM NO GLOBAL
  // instance = Template.instance();
});

Template.bulle.onRendered(function () {
  element = document.getElementById("bulle");
  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED, this);
  };
});

Template.bulle.helpers({
  openOrClosed() {
    const state = Template.instance().currentState.get();
    if (state == "FINISHED" || state == "INITIAL" || state == "CLOSED") {
      return "opacity-0";
    } else {
      return "opacity-1";
    }
  },
  state() {
    return Template.instance().currentState.get();
  },
  text() {
    return Template.instance().text.get();
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

function transition(event, facultativeContext) {
  let instance = null;

  // on est ammenés à appeler cette fonction depuis des contextes différents, et dans certains cas on a pas accès à Template.instance() donc il faut le récupérer dans les arguments de la fonction t'as vu
  if (facultativeContext) {
    instance = facultativeContext;
  } else {
    instance = Template.instance();
  }

  switch (instance.currentState.get()) {
    case "INITIAL":
      if (event === Events.CLICK) {
        instance.currentState.set(States.OPENING);
        onEnterOpening(instance);
      }
      break;

    case "OPENING":
      if (event === Events.BOX_ANIMATION_FINISHED) {
        instance.currentState.set(States.WRITING);
        onEnterWriting(instance);
      }
      break;

    case "WRITING":
      if (event === Events.END_OF_SENTENCE) {
        instance.currentState.set(States.COMPLETE);
        onEnterComplete(instance);
      }
  }
}

onEnterOpening = function (instance) {
  sentX = instance.paragraphIndex.get();
  parX = instance.sentenceIndex.get();
  instance.nextPhrase.set(textArr.acte1[sentX][parX]);
};

onEnterWriting = function (instance) {
  console.log(instance.nextPhrase.get());
  startAnimating(instance);
};

onEnterInitial = function () {
  element = document.getElementById("bulle");
  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED, this);
  };
};

onEnterComplete = function () {
  console.log("waiting click.");
};

startAnimating = function (instance) {
  index = 0;
  millisecondsPerLetter = 30;
  lastLetterIndex = instance.nextPhrase.get().length;

  prout = Meteor.setInterval(() => {
    if (index == lastLetterIndex - 1) {
      Meteor.clearInterval(prout);

      // please note that the last letter of the text will
      // appear AFTER the transition fires. that may or may not
      // be good for us.
      transition(Events.END_OF_SENTENCE, instance);
    }

    nextLetter = instance.nextPhrase.get()[0];
    oldText = instance.text.get();
    newText = oldText + nextLetter;
    instance.text.set(newText);

    instance.nextPhrase.set(instance.nextPhrase.get().substring(1));

    console.log("prout", oldText.substring(1));
    index++;
  }, millisecondsPerLetter);
};
