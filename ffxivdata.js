const log4js = require('log4js')
const axios = require('axios')
const HuntnetProxy = require('./lib/huntnetProxy')
const URL_ZONE_INSTANCES = "https://lanaklein14.github.io/ffxivdata/dist/zoneinstances.json"

const logger = log4js.getLogger()

class FFXIVDATA {
    constructor() {
        this._dataCenters = require('./dist/datacenters.json')
        this._regions = require('./dist/regions.json')
        this._zones = require('./dist/zones.json')
        this._zoneInstances = require('./dist/zoneinstances.json')
        this._huntnetProxy = new HuntnetProxy()
    }

    get dataCenters() {
        return this._dataCenters
    }

    get regions() {
        return this._regions
    }

    get zoneInstances() {
        return this._zoneInstances
    }

    async refreshZoneInstances() {
        try {
            const res = await axios.get(URL_ZONE_INSTANCES);
            this._zoneInstances = res.data;
        } catch (error) {
            const {
                status,
                statusText
            } = error.response;
            logger.error(`Error! HTTP Status: ${status} ${statusText}`);
        }
    }

    huntnetProxy() {
        return this._huntnetProxy
    }








}

module.exports = FFXIVDATA