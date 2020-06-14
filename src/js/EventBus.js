/**
 * ==================================================================================
 * EventBus: Event broadcaster for all elements
 * ==================================================================================
 **/

class EventBus {

    constructor() {
        this.events = [];
    }


    /**
     * ==================================================================================
     * @Methods
     * ==================================================================================
     **/

    /**
     * Register `callback` function to the specified `event`.
     * @param string eventName
     * @param func callback
     */
    register(eventName, callback) {
        let eventObj = this.findEvent(eventName);

        /* Push `callback` to a existing or newly created `event` */
        if(eventObj) {
            eventObj.callbacks.push(callback);
        } else {
            this.createEvent(eventName, callback);
        }
    }

    /**
     * Run all registered functions to the specified `event`
     * @param string eventName
     * @param object args
     */
    emit(eventName, args) {
        let eventObj = this.findEvent(eventName);

        /* Run all registered functions on the event */
        if(eventObj) {
            eventObj.callbacks.forEach((callback) => {
                callback(args);
            });

            // this.log("emit", " Emitting event `" + eventName + "`!\n" + (args !== undefined ? "\nParameters : {" + args + "}" : ""));
        }
    }

    /**
     * Create new `event`
     * @return object
     */
    createEvent(name, callback) {
        if(this.findEvent(name)) return;

        /* Add function to event */
        this.events.push({
            name: name,
            callbacks: [callback],
        });
    }


    /**
     * ==================================================================================
     * @Checker
     * ==================================================================================
     **/

    /**
     * Find `event` by name
     * @return object
     */
    findEvent(eventName) {
        return this.events.find(eventObj => eventObj.name === eventName);
    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    log(event, msg) {
        console.log(`EventBus.js | ${event}: ${msg}`);
    }




    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    /**
     * Render recorded controls
     * @return string
     */
    reportEvents() {
        console.log("EventBus.js | reportEvents() : Registered `Events`...");
        console.log(this.events);
    }
}


export const EVENTBUS = new EventBus();
export default EVENTBUS;