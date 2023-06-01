const device_info_keyname = "deviceInfo";
const discover_keyname = "discover";

const localStorageService = {
  /**
   * @returns deviceInfoList
   */
  getDeviceInfos: () => {
    return JSON.parse(localStorage.getItem(device_info_keyname) || "[]");
  },

  /**
   * Clear the cache of discovered devices
   */
  clearDiscoveredDevices: () => {
    if (localStorage.getItem(discover_keyname)) {
      localStorage.removeItem(discover_keyname);
    }
  },

  /**
   * Clear the cache of deviceInfo
   */
  clearDeviceInfos: () => {
    if (localStorage.getItem(device_info_keyname)) {
      localStorage.removeItem(device_info_keyname);
    }
  },

  /**
   * cache discoveredDevices against the port no.
   * @param {int} port
   * @param {*} discoveredDevices
   */
  addDiscoveredDevices: (port, discoveredDevices) => {
    let discover = {};

    //initialize if empty
    if (!localStorage.getItem(discover_keyname)) {
      localStorage.setItem(discover_keyname, JSON.stringify(discover));
    }

    const discover_data = localStorage.getItem(discover_keyname);
    if (discover_data !== null) {
      discover = JSON.parse(discover_data);
      discover[port] = discoveredDevices;
      localStorage.setItem(discover_keyname, JSON.stringify(discover));
    }
  },

  /**
   * cache deviceInfo against the port no.
   * @param {int} port
   * @param {*} decodedDeviceInfo
   */
  addDeviceInfos: (port, decodedDeviceInfo) => {
    let deviceInfo = {};

    //initialize if empty
    if (!localStorage.getItem(device_info_keyname)) {
      localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
    }

    const discover_data = localStorage.getItem(device_info_keyname);
    if (discover_data !== null) {
      deviceInfo = JSON.parse(discover_data);
      deviceInfo[port] = decodedDeviceInfo;
      localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
    }
  },
};

export { localStorageService };
