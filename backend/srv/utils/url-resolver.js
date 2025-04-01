const dns = require('dns');
const util = require('util');
const axios = require('axios');

const resolveSrv = util.promisify(dns.resolveSrv);

/**
 * Get a list of base URLs of all available radio-browser servers.
 * @returns {Promise<string[]>} A promise that resolves to an array of base URLs.
 */
async function get_radiobrowser_base_urls() {
    const hosts = await resolveSrv("_api._tcp.radio-browser.info");
    hosts.sort();
    return hosts.map(host => "https://" + host.name);
}

/**
 * Get the first available radio-browser server.
 * @returns {Promise<string>} A promise that resolves to the first available server URL.
 */
async function get_available_server() {
    const base_urls = await get_radiobrowser_base_urls();

    return Promise.race(
        base_urls.map(url =>
            axios.get(url)
                .then(() => url)  // Return the URL of the first successful response
                .catch(() => null) // Ignore failed requests
        )
    ).then(result => {
        if (!result) throw new Error("No available servers found");
        return result;
    });
}
module.exports = { get_available_server };

