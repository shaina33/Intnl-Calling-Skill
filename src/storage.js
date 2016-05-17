'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
    // function DataSearch(session, data) {
    //     if (data) {
    //         this.data = data;
    //     }
    //     this._session = session;
    // }
    
    //DataSearch.prototype = {
        return {
            searchByCode: function (intent, callback) {
                console.log("searching Dynamo for: "+ intent.slots.code.value);
                dynamodb.getItem({
                    TableName: 'CallingCodes',
                    Key: {
                        CallCode: {
                            S: intent.slots.code.value
                        }
                    }
                }, function (err, data) {
                    if (err) {
                        console.log("Error from searchByCode", err, err.stack);
                    }
                    if (data.Item) {
                        console.log("searchByCode found data with code: " + data.Item.CallCode.S);
                    }
                    callback(err,data)
                });
            },
            searchByLocation: function (callback) {
                //dynamodb scan with filter
            }
        };
})();

module.exports = storage;