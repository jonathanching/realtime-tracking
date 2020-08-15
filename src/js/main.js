/**
 * ==================================================================================
 * Main
 * ==================================================================================
 **/

import io from 'socket.io-client';
import OLMap from './elements/OLMap.js';


(function() {

    const socket = io();
    let map; // eslint-disable-line no-unused-vars


    /**
     * Initiate app
     */
    function init() {
        map = new OLMap(socket);
    }


    init();

})();