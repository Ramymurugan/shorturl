const os = require('os');

/**
 * Get the local network IPv4 address of the machine
 * @returns {string} The local IPv4 address, or 'localhost' if not found
 */
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

module.exports = { getLocalIp };
