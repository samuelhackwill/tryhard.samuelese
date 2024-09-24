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
  this.open = new ReactiveVar(false);
  this.paragraphIndex = new ReactiveVar(0);
  this.sentenceIndex = new ReactiveVar(0);
});

Template.bulle.helpers({
  text() {
    sentX = Template.instance().paragraphIndex.get();
    parX = Template.instance().sentenceIndex.get();

    return textArr.acte1[sentX][parX];
  },

  openOrClosed() {
    console.log(Template.instance().open.get());

    if (Template.instance().open.get() === true) {
      return "opacity-1";
    } else {
      return "opacity-0";
    }
  },
});

Template.bulle.events({
  "click .bulleContainer"(event, instance) {
    // ON CLICK :
    // si la fenetre est fermée, ouvre la fenetre, puis quand elle est ouverte lance l'animation où les lettres du texte s'ouvrent les unes après les autres
    // si une animation de texte ou une animation de bulle est en cours, met toutes les animations dans leur état terminé et affiche l'intégralité du texte.
    // si on est arrivé à la fin d'un texte, lance le prochain texte (ou ferme la fenetre si c'était la derniere phrase du paragraphe)

    console.log(textArr.acte1[sentX].length);

    openBulle(instance);
  },
});

openBulle = function (instance) {
  if (instance.open.get() === false) {
    instance.open.set(true);
  } else {
    instance.open.set(false);
  }
};
