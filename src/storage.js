'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
    function DataSearch(session, data) {
        if (data) {
            this.data = data;
        }
        this._session = session;
    }
    
    //DataSearch.prototype = {
        return {
            searchByCode: function (callback) {
                dynamodb.getItem({
                    TableName: 'CallingCodes',
                    Key: {
                        DialCode: {
                            S: intent.slot.value
                        }
                    }
                }, function (err, data) {
                    console.log(err, err.stack);
                    if (err) {}
                    if (callback) {
                        callback(data);
                    }
                });
            },
            searchByLocation: function (callback) {
                //dynamodb.query
                // how query for entries that have location
                // in their LocationNamesArray?
            }
        }
})();

module.exports = storage;