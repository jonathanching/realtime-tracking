'use strict'

jest.mock('../../EventBus.js');

import { EVENTBUS } from '../../EventBus.js';
import GUI from '../GUI.js'


describe('GUI.js', () => {

	let event, socket, guiObj,
		userTmp = {
			id: '123456',
			name: 'username',
		};

	beforeEach(() => {
		/* Add in DOM element */
		document.body.innerHTML =
			/* ...add modal */
			'<div id="userModal" class="chat__overlay">' +
				/* ...add username registration input */
				'<input type="text" id="userInput">' +
			'</div>' +
			/* ...add online users list */
			'<ul id="chatUsers"></ul>' +
			/* ...add message textarea */
			'<textarea id="msgInput"></textarea>' +
			/* ...add message list */
			'<ul id="chatMessages"></ul>';

		event = jest.spyOn(EVENTBUS, 'emit');
		event.mock.calls = [];
		guiObj = new GUI({ self: userTmp });
	});

	test('can show welcome message', (done) => {
		/* Trigger registration method */
		guiObj.onRegistered(userTmp);

		/* ...should hide modal */
		expect(guiObj.domUserModal.classList.contains('chat__overlay--hide')).toBeTruthy();
		/* ...should enable textarea */
		expect(guiObj.domMsgInput.disabled).toBeFalsy();
		/* ...should see welcome message */
		// console.log(guiObj.domChatList);


		done();
	});
});