'use strict';

var AlexaSkill = require('./AlexaSkill'),
DataSearch = require('./storage');

var APP_ID = 'amzn1.echo-sdk-ams.app.ec44a2ab-6a51-48e4-ad8f-963eb9546da0';

/** CallingCodeHelper is a child of AlexaSkill */
var CallingCodeHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

/** Extend AlexaSkill */
CallingCodeHelper.prototype = Object.create(AlexaSkill.prototype);
CallingCodeHelper.prototype.constructor = CallingCodeHelper;

/** onLaunch eventHandler */
CallingCodeHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = {
        speech: "This is my welcome message on launch.",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    },
    repromptText = {
        speech: "This is my welcome reprompt text.",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.ask(speechText, repromptText);
};

/** intentHandlers */
CallingCodeHelper.prototype.intentHandlers = {
    "LocationIntent": function (intent, session, response) {
        var answerCode = "34",
            speechText = "<speak>I've received the Location Intent. Pretend the correct code is plus <say-as interpret-as='digits'>" + answerCode + "</say-as></speak>",
            speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
            };
        response.tell(speechOutput);
    },
    "CodeIntent": function (intent, session, response) {
        var requestedCode = intent.slots.code.value,
        targetEntry = DataSearch.searchByCode(session, function(targetEntry) {
            if (targetEntry) {
                var speechText = "<speak>The requested location is:" + targetEntry.LocationNameSpeech + "</speak>";
            }
            else {
                var speechText = "Requested code does not exist."
            };
        
            speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
            };
            response.tell(speechOutput);   
        });
        

    },
    "AMAZON.RepeatIntent": function (intent, session, response) {
        var speechOutput = "I've received the Repeat Intent. I need to figure out how to repeat myself.";
        response.ask(speechOutput);
    },
    "AMAZON.StartOverIntent": function (intent, session, response) {
        var speechOutput = "I've received the Start Over Intent. I need to figure out how to start over.";
        response.ask(speechOutput);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "I've received the Help Intent. What would you like?";
        response.ask(speechOutput);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "I've received the Stop Intent. Goodbye";
        response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "I've received the Cancel Intent. Goodbye";
        response.tell(speechOutput);
    }
}

/** ending */
exports.handler = function (event, context) {
    var callingCodeHelper = new CallingCodeHelper();
    callingCodeHelper.execute(event, context);
};