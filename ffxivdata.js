const axios = require('axios')
const URL_ZONE_INSTANCES = "https://lanaklein14.github.io/ffxivdata/dist/zoneinstances.json"

class FFXIVDATA {
    constructor() {
        this._dataCenters = require('./dist/datacenters.json')
        this._regions = require('./dist/regions.json')
        this._zones = require('./dist/zones.json')
        this._zoneInstances = require('./dist/zoneInstances.json')
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
            console.log(`Error! HTTP Status: ${status} ${statusText}`);
        }
    }








}

module.exports = FFXIVDATA