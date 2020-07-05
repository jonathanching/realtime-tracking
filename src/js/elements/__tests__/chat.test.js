'use strict';

jest.mock('../../EventBus.js');

import { EVENTBUS } from '../../EventBus.js';
import Chat from '../Chat.js'


describe('Chat.js', () => {

	let event, socket, msgObj,
		userTmp = {
			id: '123456',
			name: 'username',
		},
		msgTmp = 'This is a message';

	beforeEach(() => {
		/* Add in DOM element */
		document.body.innerHTML = '<textarea id="msgInput">' + msgTmp + '</textarea>';

		event = jest.spyOn(EVENTBUS, 'emit');
		event.mock.calls = [];
		socket = {
			on: jest.fn(),
			emit: jest.fn(),
		};
		msgObj = new Chat(socket, {
			self: userTmp
		});
	});


	test('message on enter', (done) => {
		/* Create enter event */
		let keyUp = new KeyboardEvent('keyup');
		Object.defineProperty(keyUp, 'keyCode', {
			get: () => 13
		});

		/* Trigger keyup */
		msgObj.domMsgInput.dispatchEvent(keyUp);

		/* ...should clear textarea */
		expect(msgObj.domMsgInput.value).toBeFalsy();
		/* ...should run `new_message` socket event */
		expect(msgObj.socket.emit.mock.calls[0][0]).toBe('new_message');
		expect(msgObj.socket.emit.mock.calls[0][1]).toEqual({
			user: userTmp,
			message: msgTmp,
		});


		done();
	});

	test('can receive new message', (done) => {
		/* Trigger server websocket event */
		msgObj.socket.on.mock.calls[0][1](msgTmp);

		/* ...disconnected event should run */
		expect(event.mock.calls[event.mock.calls.length - 1][0]).toBe('newMessage');
		expect(event.mock.calls[event.mock.calls.length - 1][1]).toBe(msgTmp);


		done();
	});
});