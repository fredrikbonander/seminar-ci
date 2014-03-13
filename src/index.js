angular.module('seminar.ci', [])

.service('MessageQueue', function () {
    'use strict';
    var internalQueue = [];

    this.add = function (item) {
        internalQueue.push(item);
    };

    this.removeAtIndex = function (index) {
        return internalQueue.splice(index, 1);
    };

    this.shift = function () {
        return internalQueue.shift();
    };

    this.sayHello = function () {
        return 'Hello, earth!';
    };

    Object.defineProperty(this, 'length', {
        get: function () {
            return internalQueue.length;
        }
    });
});
