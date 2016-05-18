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
            searchByLocation: function (intent, callback) {
                console.log("searching DynamoDB for: "+ intent.slots.location.value);
                var params = {
                    TableName: 'CallingCodes',
                    ScanFilter: {
                        LocationNamesArray: {
                            ComparisonOperator: 'CONTAINS',
                            AttributeValueList: [ { S: intent.slots.location.value }, ],
                        },
                    },
                };
                dynamodb.scan(params, function (err, data) {
                    if (err) {
                        console.log("Error from searchByLocation", err, err.stack);
                    }
                    if (data.Items) {
                        if (data.Items.length == 0) {
                            console.log("Zero data items retrieved by search");
                        }
                        else {
                            for (var i in data.Items) {
                                console.log("searchByLocation retrieved data with code "+ data.Items[i].CallCode.S);
                            }
                        }
                    }
                    callback(err,data);
                });
            }
        };
})();

module.exports = storage;