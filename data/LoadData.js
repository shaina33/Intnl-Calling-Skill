var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-east-1", //"us-west-2",
    endpoint: "https://bloc-foundation-shaina33-1.c9users.io/" //"http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing Calling Code Data into DynamoDB. Please wait.");

var allCodes = JSON.parse(fs.readFileSync('data/CodeData.json', 'utf8'));
//allCodes.forEach(function(code) {
for (var code in allCodes) {
    var params = {
        TableName: "CallingCodes",
        Item: {
            "DialCode": code.DialCode,
            "LocationNamesArray":  code.LocationNamesArray,
            "DuplicateLocation": code.DuplicateLocation,
            "LocationNameText":  code.LocationNameText,
            "LocationNameSpeech": code.LocationNameSpeech,
            "DialCodeNoteText": code.DialCodeNoteText,
            "DialCodeNoteSpeech": code.DialCodeNoteSpeech
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add Code entry:", code.DialCode, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", code.DialCode);
       }
    });
};