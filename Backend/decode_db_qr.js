const mongoose = require('mongoose');
const { Jimp } = require('jimp');
const jsQR = require('jsqr');

mongoose.connect('mongodb://127.0.0.1:27017/smartlink').then(async () => {
  const Url = require('./src/models/Url');
  const doc = await Url.findOne({ shortCode: 'wqHhMv' });
  if (!doc) {
    console.log('Document wqHhMv not found.');
    process.exit(1);
  }
  
  const base64Data = doc.qrCode.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  
  Jimp.read(buffer).then(image => {
    const qrCode = jsQR(
      new Uint8ClampedArray(image.bitmap.data),
      image.bitmap.width,
      image.bitmap.height
    );
    if (qrCode) {
      console.log('Decoded DB QR Code contents:', qrCode.data);
    } else {
      console.log('No QR code found in the base64 image.');
    }
    process.exit(0);
  }).catch(err => {
    console.error('Error parsing Jimp image:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('Error connecting to DB:', err);
  process.exit(1);
});
