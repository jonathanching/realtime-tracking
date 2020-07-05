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

    const User = require('../events/User.js');
    const Message = require('../events/Message.js');
    let user, message;

    /**
     * User.js:
     * - Adding/Registration of user
     * - Removal of user
     */
    jest.mock('../data/Global.js');

    describe('User.js', () => {

        let global;

        beforeEach(() => {
            global = require('../data/Global.js');
            global.users = [];

            user = new User(server, socket);
        });

        test('should have event list', (done) => {
            expect(user.events).toBeDefined();
            done();
        });

        test('can add & remove user', (done) => {
            let socketSpy = jest.spyOn(user.socket, 'emit'),
                serverSpy = jest.spyOn(user.io.sockets, 'emit'),
                tmpUserCount = global.users.length,
                username = 'username';


            /* Adding of user */
            user.events.new_user(username);
            /* ...User added to the global collection */
            expect(global.users.length).toBeGreaterThan(tmpUserCount);
            expect(user.getUser(socket.id)).toBeDefined();
            /* ...Certain socket events should be called */
            let socCalls = socketSpy.mock.calls,
                userObj = {
                    id: socket.id,
                    name: username,
                };

            expect(socCalls[0][0]).toBe('new_user');
            expect(socCalls[0][1]).toEqual(
                expect.objectContaining(userObj)
            );
            expect(socCalls[1][0]).toBe('own_user');
            expect(socCalls[1][1]).toEqual(
                expect.objectContaining({
                    self: userObj,
                    users: expect.any(Array),
                })
            );

            let serCalls = serverSpy.mock.calls;

            /* Removal of user */
            user.events.disconnect();
            /* ...user should not be found */
            expect(user.getUser(socket.id)).toBe(-1);
            /* ...certain socket events should be called */
            expect(serCalls[0][0]).toBe('remove_user');
            expect(serCalls[0][1]).toBe(socket.id);


            done();
        });
    });

    /**
     * Message.js:
     * - Adding of message
     */
    describe('Message.js', () => {

        beforeEach(() => {
            message = new Message(server, socket);
        });

        test('should have event list', (done) => {
            expect(message.events).toBeDefined();

            done();
        });

        test('can add message', (done) => {
            let serverSpy = jest.spyOn(message.io.sockets, 'emit'),
                serCalls = serverSpy.mock.calls,
                msgObj = {
                    user: {
                        id: socket.id,
                        name: 'username',
                    },
                    message: 'This is a sample message',
                };

            /* Sending of message */
            message.events.new_message(msgObj);
            /* ...certain socket events should be called */
            expect(serCalls[serCalls.length - 1][0]).toBe('new_message');
            msgObj.date = expect.any(String);
            expect(serCalls[serCalls.length - 1][1]).toEqual(msgObj);


            done();
        });
    });
});