'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    /*
     * The Game class stores all game states for the user
     */
    function CallCode(session, data) {
        if (data) {
            this.data = data;
        } else {
            this.data = {
                players: [],
                scores: {}
            };
        }
        this._session = session;
    }

    // CallCode.prototype = {
        // isEmptyScore: function () {
        //     //check if any one had non-zero score,
        //     //it can be used as an indication of whether the game has just started
        //     var allEmpty = true;
        //     var gameData = this.data;
        //     gameData.players.forEach(function (player) {
        //         if (gameData.scores[player] !== 0) {
        //             allEmpty = false;
        //         }
        //     });
        //     return allEmpty;
        // },
        // save: function (callback) {
        //     //save the game states in the session,
        //     //so next time we can save a read from dynamoDB
        //     this._session.attributes.currentGame = this.data;
        //     dynamodb.putItem({
        //         TableName: 'ScoreKeeperUserData',
        //         Item: {
        //             CustomerId: {
        //                 S: this._session.user.userId
        //             },
        //             Data: {
        //                 S: JSON.stringify(this.data)
        //             }
        //         }
        //     }, function (err, data) {
        //         if (err) {
        //             console.log(err, err.stack);
        //         }
        //         if (callback) {
        //             callback();
        //         }
        //     });
        // }
    // };

    return {
        loadCallCode: function (intent, session, callback) {
            if (session.attributes.currentCallCode) {
                console.log('get game from session=' + session.attributes.currentCallCode);
                callback(new CallCode(session, session.attributes.currentCallCode));
                return;
            }
            dynamodb.getItem({
                TableName: 'CallingCodes',
                Key: {
                    CallCode: {
                        S: intent.slots.code.value
                    }
                }
            }, function (err, data) {
                var currentCallCode;
                if (err) {
                    console.log(err, err.stack);
                    currentCallCode = new CallCode(session);
                    session.attributes.currentCallCode = currentCallCode.data;
                    callback(currentCallCode);
                } else if (data.Item === undefined) {
                    currentCallCode = new CallCode(session);
                    session.attributes.currentCallCode = currentCallCode.data;
                    callback(currentCallCode);
                } else {
                    console.log('get game from dynamodb=' + data.Item.Data.S);
                    currentCallCode = new CallCode(session, JSON.parse(data.Item.Data.S));
                    session.attributes.currentCallCode = currentCallCode.data;
                    callback(currentCallCode);
                }
            });
        },
        newGame: function (session) {
            return new CallCode(session);
        }
    };
})();
module.exports = storage;
