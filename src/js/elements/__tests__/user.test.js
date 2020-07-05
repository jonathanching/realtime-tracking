'use strict';

jest.mock('../../EventBus.js');

import { EVENTBUS } from '../../EventBus.js';
import User from '../User.js'


describe('User.js', () => {

	let event, socket, userObj,
		userTmp = {
			id: '123456',
			name: 'username',
		};

	beforeEach(() => {
		/* Add in DOM element */
		document.body.innerHTML = '<input type="text" id="userInput" value="' + userTmp.name + '">';

		event = jest.spyOn(EVENTBUS, 'emit');
		event.mock.calls = [];
		socket = {
			on: jest.fn(),
			emit: jest.fn(),
		};
		userObj = new User(socket);
	});


	test('should register on enter', (done) => {
		/* Create enter event */
		let keyUp = new KeyboardEvent('keyup');
		Object.defineProperty(keyUp, 'keyCode', {
			get: () => 13
		});
		/* Trigger keyup */
		userObj.domUserInput.dispatchEvent(keyUp);

		/* ...should run `new_user` socket event */
		expect(userObj.socket.emit.mock.calls[0][0]).toBe('new_user');
		expect(userObj.socket.emit.mock.calls[0][1]).toBe(userTmp.name);


		done();
	});

	test('can receive registration callback', (done) => {
		/* Trigger server websocket event */
		userObj.socket.on.mock.calls[0][1]({
			self: userTmp,
			users: [userTmp],
		});

		/* ...user should be saved */
		expect(userObj.self).toBeDefined();
		expect(userObj.hasUser(userTmp.id)).toBeTruthy();
		/* ...certain events should run */
		expect(event.mock.calls[0][0]).toBe('connectedUser');
		expect(event.mock.calls[0][1]).toBe(userTmp);
		expect(event.mock.calls[1][0]).toBe('registered');
		expect(event.mock.calls[1][1]).toBe(userTmp);


		done();
	});

	test('can receive user disconnection callback', (done) => {
		/* Trigger server websocket event */
		userObj.socket.on.mock.calls[2][1](userTmp.id);

		/* ...should remove user */
		expect(userObj.hasUser(userTmp.id)).toBeFalsy();
		/* ...certain events should run */
		userObj.socket.on.mock.calls[0][1]({
			self: userTmp,
			users: [userTmp],
		});

		/* ...user should be saved */
		expect(userObj.self).toBeDefined();
		expect(userObj.hasUser(userTmp.id)).toBeTruthy();
		/* ...disconnected event should run */
		expect(event.mock.calls[0][0]).toBe('disconnectedUser');
		expect(event.mock.calls[0][1]).toBe(userTmp.id);


		done();
	});
});