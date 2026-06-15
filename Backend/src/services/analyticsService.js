const Analytics = require('../models/Analytics');
const Url = require('../models/Url');

/**
 * Record a visit to a shortened URL
 * @param {string} urlId - The ID of the Url document
 * @param {object} req - Express request object to parse details
 */
const recordVisit = async (urlId, req) => {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
    const referrer = req.headers['referer'] || 'Direct';

    // Parse basic OS, Browser, Device
    let os = 'Unknown';
    let browser = 'Unknown';
    let device = 'Desktop';

    // Basic Browser Detection
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('SamsungBrowser')) browser = 'Samsung Browser';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
    else if (userAgent.includes('Trident')) browser = 'Internet Explorer';
    else if (userAgent.includes('Edge') || userAgent.includes('Edg')) browser = 'Edge';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';

    // Basic OS Detection
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Macintosh') || userAgent.includes('Mac OS X')) os = 'macOS';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    else if (userAgent.includes('Linux')) os = 'Linux';

    // Basic Device Detection
    if (userAgent.includes('Mobi') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      device = 'Mobile';
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      device = 'Tablet';
    }

    // Basic IP geolocation (resolve real IPs, mock local IPs for testing)
    let country = 'United States';
    if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress.startsWith('127.0.') || ipAddress.startsWith('192.168.')) {
      const mockCountries = ['India', 'United States', 'United Kingdom', 'Germany', 'Canada', 'Australia'];
      country = mockCountries[Math.floor(Math.random() * mockCountries.length)];
    } else {
      try {
        const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
        const geo = await res.json();
        if (geo && geo.status === 'success') {
          country = geo.country || 'United States';
        }
      } catch (err) {
        console.error('IP Geolocation error:', err);
      }
    }

    // Save Analytics log
    await Analytics.create({
      urlId,
      ipAddress,
      userAgent,
      browser,
      os,
      device,
      referrer,
      country
    });

    // Increment click counter in Url model
    await Url.findByIdAndUpdate(urlId, { $inc: { clicks: 1 } });
  } catch (err) {
    console.error('Error logging analytics visit:', err);
  }
};

module.exports = { recordVisit };
