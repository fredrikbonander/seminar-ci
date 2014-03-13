describe('seminar-ci app', function () {
    'use strict';

    beforeEach(module('seminar.ci'));

    it('should store item in queue', inject(function (MessageQueue) {
        MessageQueue.add('Scrooge');
        expect(MessageQueue.length).toBe(1);
    }));

    it('should remove item from queue at specified index', inject(function (MessageQueue) {
        MessageQueue.add('Scrooge');
        MessageQueue.add('numberSix');
        MessageQueue.add('monkey');

        expect(MessageQueue.removeAtIndex(1)).toEqual(['numberSix']);
        expect(MessageQueue.length).toBe(2);
    }));
});
