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
        if (!response.ok && response.status != 304) {
            const msg = `[${response.url}]: ${response.statusText} - ${response.status}`;
            logger.error(JSON.stringify(response));
            throw new Error(msg);
        }
        return response
    }
    catch (err) {
        if (err.name === 'AbortError') {
            logger.error(`fetch timeout error -> ${err.message}, ${url}`)
        }
        else if (!err.response) {
            logger.error(`fetch unknown error -> ${err.message}, ${url}`)
            logger.error(`${err}`)
        }
        else if (err.response.status == 403) {
            logger.error(`fetch 403 error -> ${err.message}, ${url}`)
        }
        else {
            logger.error(`fetch failed -> ${err.message}, ${url}`)
        }
    }
}
