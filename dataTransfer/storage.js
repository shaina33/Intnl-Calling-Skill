/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1", //"us-west-2",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com" //"http://localhost:8000"
});

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    return {
        save: function (session, callback) {
            //save the game states in the session,
            //so next time we can save a read from dynamoDB
            //this._session.attributes.currentGame = this.data;
            dynamodb.putItem(session.attributes.params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                if (callback) {
                    callback();
                }
            });
        }
    };
})();
module.exports = storage;
