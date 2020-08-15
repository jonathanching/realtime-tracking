const clientIO = require('socket.io-client');
const http = require('http');
const serverIO = require('socket.io');

let client;
let server;
let socket;
let httpServer;
let httpServerAddr;


/**
 * ==================================================================================
 * @Setup connection
 * ==================================================================================
 **/

/* Websocket & HTTP servers */
beforeAll((done) => {
    httpServer = http.createServer().listen();
    httpServerAddr = httpServer.address();
    server = serverIO(httpServer);

    require('../events.js')(server);
    server.once('connection', (mySocket) => {
        socket = mySocket;
    });

    done();
});

/* Socket connection */
beforeEach((done) => {
    client = clientIO.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
    });

    client.on('connect', () => {
        done();
    });
});

/* Cleanup WS & HTTP servers */
afterAll((done) => {
    server.close();
    httpServer.close();

    done();
});

/* Socket disconnection */
afterEach((done) => {
    if(client.connected) {
        client.disconnect();
    }

    done();
});


/**
 * ==================================================================================
 * @Tests
 * ==================================================================================
 **/

/**
 * @Websocket
 * ==================================================================================
 **/
describe('Socket.io', () => {
    /* Checks on & emit events */
    test('should communicate', (done) => {
        let msg = 'Test';

        server.emit('echo', msg);
        client.once('echo', (message) => {
            expect(message).toBe(msg);

            done();
        });
    });
    /* Checks if server socket binds all event on `events/*.js` */
    test('should bind events', (done) => {
        expect(socket.eventNames().length).toBeGreaterThan(1);

        done();
    });
});

/**
 * @Events
 * ==================================================================================
 **/
describe('Event handlers', () => {

    //
});