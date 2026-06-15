const QRCode = require('qrcode');

/**
 * Generates a base64 QR Code image data URL for a given URL
 * @param {string} url - The URL to encode
 * @returns {Promise<string>} Base64 Data URL
 */
const generateQRCode = async (url) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return qrCodeDataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    throw new Error('QR Code generation failed');
  }
};

module.exports = { generateQRCode };
