const Alexa = require("ask-sdk");

function pluck(arr) {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

const WellRestedPhrases = {
  tooMuch: [
    "I think you may sleep too much and swing back to tired.",
    "whoa, that's a lot of sleep. You'll wake up rested for sure."
  ],
  justRight: [
    "you should wake up refreshed.",
    "it's clear you know rest is important. Good job, you.",
    "with that much sleep, you're ready to face the world.",
    "you'll wake up invigorated."
  ],
  justUnder: [
    "you may get by, but watch out for a mid-day crash.",
    "you'll be alright, but would be better off with a bit more time.",
    "you might be a little tired tomorrow."
  ],
  tooLittle: [
    "you'll be dragging tomorrow. Get the coffee ready!",
    "that's either a long night or early morning? Either" +
      "way, tomorrow's going to be rough."
  ]
};

const WellRestedIntentHandler = {
  canHandle(handlerInput) {
    const intentName = "WellRestedIntent";

    return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === intentName;
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;

    let numOfHours = slots.NumberOfHours.value;
    numOfHours = parseInt(numOfHours);

    const resolutionValues = slots.SleepQuality &&
      slots.SleepQuality.resolutions &&
      slots.SleepQuality.resolutions.resolutionsPerAuthority[0] &&
      slots.SleepQuality.resolutions.resolutionsPerAuthority[0].values;

    if (Number.isInteger(numOfHours)) {
      let speech;

      if (resolutionValues) {
        const quality = values[0].value.id;
        
        if (quality === "good") {
          numOfHours += 1;
          speech = "You slept well last night, and ";
        }

        if (quality === "bad") {
          numOfHours -= 1;
          speech = "You slept poorly last night, and ";
        }
      }

      if (numOfHours > 12) {
        speech += pluck(WellRestedPhrases.tooMuch);
      } else if (numOfHours > 8) {
        speech += pluck(WellRestedPhrases.justRight);
      } else if (numOfHours > 6) {
        speech += pluck(WellRestedPhrases.justUnder);
      } else {
        speech += pluck(WellRestedPhrases.tooLittle);
      }

      return handlerInput.responseBuilder.speak(speech).getResponse();
    } else {
      console.log("Slot values ", slots);

      const speech =
        "Oh, I don't know what happened. Tell me again. " +
        "How many hours will you sleep tonight?";
      const reprompt = "How many hours are you going to sleep tonight?";

      return handlerInput.responseBuilder
        .speak(speech)
        .reprompt(reprompt)
        .getResponse();
    }
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    const intentName = "AMAZON.HelpIntent";

    return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === intentName;
  },
  handle(handlerInput) {
    const speech = "You can ask Super Sleeper how well rested you'll be or " +
                    "share how well you slept the night before. Try saying " +
                    "'How tired will I be if sleeping 8 hours.'";
    const reprompt = "You can also say something like, '5 hours of sleep " +
                     "and slept well last night'";

    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt)
      .getResponse();
  }
};

const StopOrCancelIntentHandler = {
  canHandle(handlerInput) {
    const stopIntentName = "AMAZON.StopIntent";
    const cancelIntentName = "AMAZON.CancelIntent";

    return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name === stopIntentName ||
      handlerInput.requestEnvelope.request.intent.name === cancelIntentName);
  },
  handle(handlerInput) {
    const speech = "Alright, see you around and sleep well.";

    return handlerInput.responseBuilder
      .speak(speech)
      .getResponse();
  }
};

const skillId = "<YOUR SKILL ID>";
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    WellRestedIntentHandler,
    HelpIntentHandler,
    StopOrCancelIntentHandler
  )
  .withSkillId(skillId)
  .lambda();
