import dns from 'node:dns';
import util from 'node:util';
import axios from 'axios';

const resolveSrv = util.promisify(dns.resolveSrv);

/**
 * Get a list of base URLs of all available radio-browser servers.
 * @returns {Promise<string[]>} A promise that resolves to an array of base URLs.
 */
async function _get_radiobrowser_base_urls() {
  const hosts = await resolveSrv('_api._tcp.radio-browser.info');
  hosts.sort();
  return hosts.map((host) => 'https://' + host.name);
}

/**
 * Get the first available radio-browser server.
 * @returns {Promise<string>} A promise that resolves to the first available server URL.
 */
export async function get_available_server(retries) {
  const base_urls = await _get_radiobrowser_base_urls();
  if (!retries) throw new Error(`No available servers at the moment`);
  return Promise.race(
    base_urls.map(
      (url) =>
        axios
          .get(url)
          .then(() => url)
          .catch(() => null)
    )
  ).then(async (result) => {
    console.log(result)
    while (!result && retries) {
      console.log(`No available server...Retry: ${retries}`);
      await get_available_server(retries--);
    }
    return result;
  });
}
