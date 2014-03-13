describe('seminar-ci app', function () {
    'use strict';

    beforeEach(module('seminar.ci'));

    it('should store item in queue', inject(function (MessageQueue) {
        MessageQueue.add('Scrooge');
        expect(MessageQueue.length).toBe(1);
    }));
});
