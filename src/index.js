'use strict';

var AlexaSkill = require('./AlexaSkill'),
storage = require('./storage');

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
        // if (data.Item.CallCodeNoteSpeech.S != "0") {
        //                 speechText = data.Item.CallCodeNoteSpeech;
        //             }
    },
    "CodeIntent": function (intent, session, response) {
        var speechText, speechOutput;
        function DataSearch (callback){
            storage.searchByCode(intent, function (err, data) {
                if (data.Item) {
                    console.log('Index received data with code: ' + data.Item.CallCode.S);
                        speechText = "<speak>The calling code +<say-as interpret-as=\"digits\">" 
                                        + data.Item.CallCode.S + "</say-as>refers to " 
                                        + data.Item.LocationNameSpeech.S + "</speak>";
                }
                else {
                    console.log("No data item received in index function");
                    speechText = "I'm sorry. I cannot find that calling code.";
                }
                if (err) {
                    console.log("Error received by index function", err, err.stack);
                }
                speechOutput = {
                    speech: speechText,
                    type: AlexaSkill.speechOutputType.SSML
                };
                callback(speechOutput);
            });
        }
        function giveResponse (speechOutput) {
            response.tell(speechOutput);
        }
        DataSearch(giveResponse);
        // this calls storage.searchByCode, then preps speechOutput, then calls giveResponse
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
};

/** ending */
exports.handler = function (event, context) {
    var callingCodeHelper = new CallingCodeHelper();
    callingCodeHelper.execute(event, context);
};