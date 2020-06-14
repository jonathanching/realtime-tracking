/**
 * ==================================================================================
 * Main
 * ==================================================================================
 **/

import io from 'socket.io-client';

import GUI from './elements/GUI.js';
import User from './elements/User.js';
import Chat from './elements/Chat.js';


(function() {

    const socket = io();
    let gui, user, chat; // eslint-disable-line no-unused-vars


    /**
     * Initiate app
     */
    function init() {
        user = new User(socket);
        chat = new Chat(socket, user);
        gui = new GUI(user);
    }


    init();

})();