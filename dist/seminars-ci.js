/**
 * seminars-ci - v0.1.0 - 2014-03-13
 * http://www.ef.com
 *
 * Copyright (c) 2014 EF Education First - CTX
 * Licensed TODO <ADD LICENSING URL>
 */
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
