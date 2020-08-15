/**
 * ==================================================================================
 * OLMap.js: OpenLayer map component
 * ==================================================================================
 **/

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon.js';
import PointGeom from 'ol/geom/Point.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import TileLayer from 'ol/layer/Tile.js';
import { fromLonLat } from 'ol/proj.js';
import OSM from 'ol/source/OSM.js';

export default class OLMap {

	constructor(socket, {
			target = 'map',
			position = [ 80.24586, 12.9859 ],
		} = {}
	) {
		this.socket = socket;
		this.target = target;
		this.position = position;

		this.map = null;
		this.features = [];
		this.marker = null;
		this.hasLoaded = false;

		this.init();
	}


	/**
	 * ==================================================================================
	 * @Methods
	 * ==================================================================================
	 **/

	init() {
		this.initMap();
		this.bindEvents();

		// this.__testMove();
	}


	initMap() {
		this.map = new Map({
			target: this.target,
			layers: [
				new TileLayer({
					source: new OSM(this.position)
				})
			],
			view: new View({
				center: fromLonLat(this.position),
				zoom: 15
			})
		});

		/* Create features... */
		this.initMarker();
		/* ...then add it */
		this.map.addLayer(
			new VectorLayer({
				source: new VectorSource({
					features: this.features
				}),
			})
		);
	}

	initMarker() {
		if(!this.map)
			return console.error('OLMap.js | setupMarker: Map must be defined');

		this.marker = new Feature({
			geometry: new PointGeom(
				fromLonLat(this.position)
			),
		});

		this.marker.setStyle(new Style({
				image: new Icon({
					src: 'images/marker.png'
				})
			})
		);

		this.features.push(this.marker);
	}


	/**
	 * Bind websocket events
	 */
	bindEvents() {
		this.socket.on('locationUpdate', (data) => {

			/**
			 * Enable controls on initial location update to
			 * avoid wrong movement
			 */
			if(!this.hasLoaded) {
				this.bindControls();
				this.hasLoaded = true;
			}

			this.log('locationUpdate', data);
			this.updateCoords(JSON.parse(data));
		});
	}

	/**
	 * Bind arrow controls
	 */
	bindControls() {
		[...document.querySelectorAll('.arrow[data-arrow]')].forEach((elem) => {
			elem.addEventListener('click', (e) => {
				let move = this.getMovement(e.target.getAttribute('data-arrow'));

				if(move)
					this.arrowMove(move);
			});
		});
	}


	/**
	 * ==================================================================================
	 * @Controller
	 * ==================================================================================
	 **/

	/**
	 * Trigger coordinate movement
	 * @param {Array} coords
	 */
	arrowMove(coords) {
		this.socket.emit('lastKnownLocation', [
			this.position[0] + coords[0],
			this.position[1] + coords[1],
		]);
	}

	/**
	 * Update marker coordinates
	 * @param {Array} coords
	 */
	updateCoords(coords) { console.log(coords);
		if(!this.marker)
			return console.error('OLMap.js | updateCoords: Marker must be defined');

		this.position = coords;

		/* Convert to proper coordinate object */
		coords = fromLonLat(coords);

		this.marker.getGeometry().setCoordinates(coords);
		this.map.getView().setCenter(coords);
	}


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Get corresponding movement on array
     * @param  {String} m
     * @return {Array}
     */
	getMovement(m) {
		switch (m.toLowerCase()) {
			case 'up': return [0.00, 0.001];
			case 'down': return [0.00, -0.001];
			case 'left': return [-0.001, 0.00];
			case 'right': return [0.001, 0.00];
		}
	}


    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    log(event, msg) {
		console.log(`OLMap.js | ${event}: ${msg}`);
    }


    /**
     * Simulate movement of coordinates
     * @param {Integer} noOfMoves
     * @param {Integer} interval
     */
	__testMove(noOfMoves = 10, interval = 1000) {
		const decimalLength = (n) => Math.floor(n) === n ? 1 : n.toString().split(".")[1].length || 1;
		const incrementBy = (n) => parseFloat("0." + "0".repeat(n - 1) + "1");

		let currLon = this.position[0], currLat = this.position[1],
			incLon = decimalLength(currLon), incLat = decimalLength(currLat),
			movements = [];

		/* Create random movements */
		for(var i = 0; i < noOfMoves; i++) {
			currLon += incrementBy(incLon);
			currLat += incrementBy(incLat);

			movements.push([currLon, currLat]);
		}

		this.log('__testMove', 'Beginning movement simulation...');
		setInterval(() => {
			if(movements.length) {
				let move = movements.shift();

				this.socket.emit('lastKnownLocation', move);
				this.log('Moving', move);
			}
		}, interval);
    }
}