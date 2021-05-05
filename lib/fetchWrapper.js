const AbortController = require('abort-controller');
const fetch = require('node-fetch');
const logger = require('log4js').getLogger();

module.exports = async (url, option) => {
    const controller = new AbortController()
    option.signal = controller.signal
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    try {
        const response = await fetch(url, option);
        clearTimeout(timeoutId)
        if (!response.ok) {
            const msg = `[${res.url}]: ${res.statusText} - ${res.body}`
            throw new Error(msg)
        }
        return response
    }
    catch (err) {
        if (err.name === 'AbortError') {
            logger.error(`fetch2 timeout error -> ${err.message}, ${url}`)
        }
        else if (!err.response) {
            logger.error(`fetch2 unknown error -> ${err.message}, ${url}`)
        }
        else if (err.response.status == 403) {
            logger.error(`fetch2 403 error -> ${err.message}, ${url}`)
        }
        else {
            logger.error(`fetch2 failed -> ${err.message}, ${url}`)
        }
    }
}
