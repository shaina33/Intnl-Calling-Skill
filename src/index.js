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
        speech: "Welcome to the International Calling Codes Directory. "
                +"You can ask about calling codes, or locations. How can I help you?",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    },
    repromptText = {
        speech: "You can ask about calling codes, or locations. If you'd like more information, you can say, help.",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.ask(speechText, repromptText);
};

/** intentHandlers */
CallingCodeHelper.prototype.intentHandlers = {
    
    "LocationIntent": function (intent, session, response) {
        var speechText, speechOutput, repromptText, locationList = "";
        function DataSearch(callback) {
            storage.searchByLocation(intent, function (err, data) {
                if (data.Items.length > 0) {
                    console.log("Index received " + data.Items.length + " data item(s)");
                    if (data.Items.length > 1) { //more than one matching location found
                        for (var i in data.Items) {
                            if (data.Items[i].CallCodeNoteSpeech.S == "0") {
                                locationList = locationList.concat(" ", data.Items[i].LocationNameSpeech.S
                                                + " uses calling code +<say-as interpret-as=\"digits\">" + data.Items[i].CallCode.S + "</say-as>.");
                                console.log("locationList is: "+locationList);
                            }
                            else {
                                locationList = locationList.concat(" ", data.Items[i].CallCodeNoteSpeech.S);
                                console.log("locationList is: "+locationList);
                            }
                        }
                        speechText = "<speak>I've found a few locations matching your request." + locationList + "</speak>";
                    }
                    else { //one matching location found
                        if (data.Items[0].CallCodeNoteSpeech.S == "0") {
                            speechText = "<speak>The calling code for " + data.Items[0].LocationNameSpeech.S + 
                                        " is plus <say-as interpret-as=\"digits\">" + data.Items[0].CallCode.S + "</say-as></speak>";
                        }
                        else {
                            speechText = "<speak>"+data.Items[0].CallCodeNoteSpeech.S+"</speak>";
                        }
                    }    
                    speechOutput = {
                        speech: speechText,
                        type: AlexaSkill.speechOutputType.SSML
                    };
                    callback(session, speechOutput);
                }
                else { //no matching locations found
                    console.log("No data items received by index function");
                    speechText = "I'm sorry. I cannot find that location. Remember to request countries or independent territories, and to always use complete English names. "+
                                "You can say help, stop, or ask your question again.";
                    repromptText = "You can say help, stop, or ask a question. How can I help you?"
                    response.ask(speechText, repromptText)
                }
                if (err) {
                    console.log("Error received by index function", err, err.stack);
                }

                // repromptText = {
                //     speech: "Is there anything else I can help you with? If you're finished, you can say stop.",
                //     type: AlexaSkill.speechOutputType.PLAIN_TEXT
                // };
                // callback(session, speechOutput, repromptText);
            });
        }
        function giveResponse (session, speechOutput, repromptText) {
            // session.attributes.lastSpeechOutput = speechOutput;
            // session.attributes.lastRepromptText = repromptText
            // response.ask(speechOutput, repromptText);
            response.tell(speechOutput);
        }
        // if slot value received, DataSearch calls storage.searchByCode, then preps speechOutput, then calls giveResponse
        if (intent.slots.location.value) { DataSearch(giveResponse) }
        else {
            speechOutput = "I'm sorry, I could not understand your request. "+
                            "Try saying something like, What's the calling code for Spain?";
            repromptText = "If you'd like more information about what you can ask, say help. To close the skill, say stop.";
            // giveResponse(session,speechOutput, repromptText);
            response.ask(speechOutput, repromptText);
        }
    },
    
    "CodeIntent": function (intent, session, response) {
        var speechText, speechOutput, repromptText;
        function DataSearch (callback){
            storage.searchByCode(intent, function (err, data) {
                if (data.Item) { // match found
                    console.log('Index received data with code: ' + data.Item.CallCode.S);
                    speechText = "<speak>The calling code +<say-as interpret-as=\"digits\">" 
                                    + data.Item.CallCode.S + "</say-as>refers to " 
                                    + data.Item.LocationNameSpeech.S + "</speak>";
                    speechOutput = {
                        speech: speechText,
                        type: AlexaSkill.speechOutputType.SSML
                    };
                    callback(session, speechOutput);
                }
                else { // no match found
                    console.log("No data item received in index function");
                    speechText = "I'm sorry. I cannot find that calling code. "+
                                "Try saying something like, Where is plus three four calling from? or, what location has the code plus 1?";
                    repromptText = "If you'd like more information about what you can ask, say help. To close the skill, say stop.";
                    response.ask(speechText, repromptText)
                }
                if (err) {
                    console.log("Error received by index function", err, err.stack);
                }

                // repromptText = {
                //     speech: "Is there anything else I can help you with? If you're finished, you can say stop.",
                //     type: AlexaSkill.speechOutputType.PLAIN_TEXT
                // };
                // callback(session, speechOutput, repromptText);
            });
        }
        function giveResponse (session, speechOutput, repromptText) {
            // session.attributes.lastSpeechOutput = speechOutput;
            // session.attributes.lastRepromptText = repromptText
            // response.ask(speechOutput, repromptText);
            response.tell(speechOutput);
        }
        // if slot value received, DataSearch calls storage.searchByCode, then preps speechOutput, then calls giveResponse
        if (intent.slots.code.value) { DataSearch(giveResponse) }
        else {
            speechOutput = "I'm sorry, I could not understand your request. "+
                            "Try saying something like, What location has the calling code plus three four?";
            repromptText = "If you'd like more information about what you can ask, say help. To close the skill, say stop.";
            // giveResponse(session,speechOutput, repromptText);
            response.ask(speechOutput, repromptText);
        }
    },
    
    // "AMAZON.RepeatIntent": function (intent, session, response) {
    //     response.ask(session.attributes.lastSpeechOutput, session.attributes.lastRepromptText);
    // },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "You can provide a location and ask for its international calling code, "+
                            "or you can provide a code and ask for its location. "+
                            "Be sure that you ask about countries or territories, not specific cities. "+
                            "For example, you can say, what's the calling code for Spain?, "+
                            "or, where is plus three four calling from? "+
                            "Now, what would you like to ask?",
            repromptText = "You can ask about a particular location or a particular calling code. "+
                            "If you need more help, you can say help. If you want to close this skill, you can say stop.";
        response.ask(speechOutput, repromptText);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/** ending */
exports.handler = function (event, context) {
    var callingCodeHelper = new CallingCodeHelper();
    callingCodeHelper.execute(event, context);
};