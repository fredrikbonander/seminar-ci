angular.module('seminar.ci', [])

.service('MessageQueue', function () {
    'use strict';
    var internalQueue = [];

    this.add = function (item) {
        internalQueue.push(item);
    };

    this.shift = function () {
        return internalQueue.shift();
    };

    Object.defineProperty(this, 'length', {
        get: function () {
            return internalQueue.length;
        }
    });
});
