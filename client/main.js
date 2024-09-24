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
  END_OF_PARAGRAPH: "END_OF_PARAGRAPH",
  EVENT_LISTENER_ADDED: "EVENT_LISTENER_ADDED",
  TEXT_ANIMATION_FINISHED: "TEXT_ANIMATION_FINISHED",
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
  onEnterInitial(this);
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
      if (event === Events.END_OF_SENTENCE || event === Events.CLICK) {
        instance.currentState.set(States.COMPLETE);
        onEnterComplete(instance);
      }
      break;

    case "COMPLETE":
      if (event === Events.CLICK) {
        parX = instance.paragraphIndex.get();
        sentX = instance.sentenceIndex.get();

        // console.log(sentX);
        // console.log("paragraph length ", textArr.acte1[parX].length - 1);

        if (sentX >= textArr.acte1[parX].length - 1) {
          instance.currentState.set(States.CLOSING);
          onEnterClosing(instance);
        } else {
          instance.currentState.set(States.OPEN);
          onEnterOpen(instance);
        }
      }
      break;

    case "OPEN":
      if (event === Events.END_OF_PARAGRAPH) {
        instance.currentState.set(States.WRITING);
        onEnterWriting(instance);
      }

      break;

    case "CLOSING":
      if (event === Events.EVENT_LISTENER_ADDED) {
        instance.currentState.set(States.CLOSED);
        onEnterClosed(instance);
      }
      break;

    case "CLOSED":
      if (event === Events.CLICK) {
        parX = instance.paragraphIndex.get();
        if (parX >= textArr.acte1.length - 1) {
          instance.currentState.set(States.FINISHED);
          onEnterFinished(instance);
        } else {
          instance.currentState.set(States.OPENING);
          onEnterOpening(instance);
        }
      }
      break;

    case "FINISHED":
      if (event === Events.CLICK) {
        alert("Text is finished mate. You can restart if you want");
        instance.currentState.set(States.INITIAL);
        onEnterInitial(instance);
      }
      break;
  }
}

onEnterOpening = function (instance) {
  parX = instance.paragraphIndex.get();
  sentX = instance.sentenceIndex.get();
  instance.nextPhrase.set(textArr.acte1[parX][sentX]);
};

onEnterWriting = function (instance) {
  console.log(instance.nextPhrase.get());
  startAnimating(instance);
};

onEnterInitial = function (instance) {
  parX = instance.paragraphIndex.set(0);
  sentX = instance.sentenceIndex.set(0);

  element = document.getElementById("bulle");
  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED, instance);
  };
};

onEnterComplete = function (instance) {
  Meteor.clearInterval(prout);

  restOfTheText = instance.nextPhrase.get();

  console.log(restOfTheText);

  oldText = instance.text.get();
  newText = oldText + restOfTheText;
  instance.text.set(newText);
};

onEnterClosing = function (instance) {
  element = document.getElementById("bulle");

  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED, this);
  };

  transition(Events.EVENT_LISTENER_ADDED, instance);
};

onEnterClosed = function (instance) {
  element = document.getElementById("bulle");
  element.ontransitionend = () => {
    transition(Events.BOX_ANIMATION_FINISHED, instance);
  };

  instance.text.set("");

  parX = instance.paragraphIndex.get() + 1;

  instance.sentenceIndex.set(0);

  instance.paragraphIndex.set(parX);
};

onEnterOpen = function (instance) {
  instance.sentenceIndex.set(instance.sentenceIndex.get() + 1);

  sentX = instance.paragraphIndex.get();
  parX = instance.sentenceIndex.get();
  instance.nextPhrase.set(textArr.acte1[sentX][parX]);

  instance.text.set("");

  transition(Events.END_OF_PARAGRAPH, instance);
};

onEnterFinished = function (instance) {
  console.log("waiting for click");
};

startAnimating = function (instance) {
  index = 0;
  millisecondsPerLetter = 50;
  lastLetterIndex = instance.nextPhrase.get().length;

  prout = Meteor.setInterval(() => {
    if (index == lastLetterIndex - 1) {
      // please note that the last letter of the text will
      // be fired by the onEnterComplete function. Why is that?
      // because we also want it to be able to print everything
      // d'un coup on click.
      transition(Events.END_OF_SENTENCE, instance);
      return;
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
