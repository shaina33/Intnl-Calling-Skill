// Setup
'use strict';

var AlexaSkill = require('./AlexaSkill'),
    codeData = require('./testCodeData'), // replace with proper .js file, containing data in JSON format
    storage = require('./storage');

var APP_ID = "amzn1.echo-sdk-ams.app.652dfae7-ce58-43c7-9e65-cf9c41931e02"; // use APP_ID from Alexa Skill;

var DataTransferHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

DataTransferHelper.prototype = Object.create(AlexaSkill.prototype);
DataTransferHelper.prototype.constructor = DataTransferHelper;

// Function OnLaunch
DataTransferHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {

    Object.keys(codeData).forEach(function(element) {
        console.log("Data for code:" + element);
        console.log("keys for code:" + Object.keys(codeData[element]));

        var params = {
            TableName: "CallingCodes",
            Item: {
                CallCode: {
                    S: element
                },
                LocationNamesArray: {
                    S: codeData[element]['LocationNamesArray']
                },
                DuplicateLocation: {
                    S: codeData[element]['DuplicateLocation']
                },
                LocationNameText: {
                    S: codeData[element]['LocationNameText']
                },
                LocationNameSpeech: {
                    S: codeData[element]['LocationNameSpeech']
                },
                CallCodeNoteText: {
                    S: codeData[element]['DialCodeNoteText']
                },
                CallCodeNoteSpeech: {
                    S: codeData[element]['DialCodeNoteSpeech']
                }
            }
        };

    session.attributes.params = params;
    storage.save(session, function() {
      console.log("calling db.putItem with params: " + JSON.stringify(params));
    });
  });
};

// Finish
exports.handler = function (event, context) {
    var dataTransferHelper = new DataTransferHelper();
    dataTransferHelper.execute(event, context);
};
