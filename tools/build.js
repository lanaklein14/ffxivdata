const log4js = require('log4js')
const fs = require('fs')
const zones = require('../data/zones.json')
const regions = require('../data/regions.json')

log4js.configure({
    appenders: {
        console: { type: 'console' },
        logfile: { type: 'file', filename: './logs/debug.log' },
    },
    categories: { default: { appenders: ['console', 'logfile'], level: 'debug' } }
})
const logger = log4js.getLogger()

const outRegions = (regions) => {
    const outRegions = []
    regions.forEach(region => {
        outRegions.push({
            key: region.key,
            name: region.name,
            class: region.class,
            zoneIds: region.zoneIds
        })
    })
    fs.writeFileSync('./dist/regions.json', JSON.stringify(outRegions, null, 2));
    logger.debug('out file => ./dist/regions.json');
}

const outZones = (zones) => {
    fs.writeFileSync('./dist/zones.json', JSON.stringify(zones, null, 2));
    logger.debug('out file => ./dist/zones.json');
}

const outZoneInstances = (zones) => {
    const outZones = []
    zones.forEach(zone => {
        outZones.push({
            id: zone.id,
            name: zone.name,
            insCount: 1
        })
    })
    fs.writeFileSync('./dist/zoneinstances.json', JSON.stringify(outZones, null, 2));
    logger.debug('out file => ./dist/zoneinstances.json');
}

//main
outRegions(regions)
outZones(zones)
outZoneInstances(zones)
