const crypto = require('crypto');

exports.processImage = (name, mime) => {
  const [_, format] = mime.split('/');
  // validate extension
  const validExt = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
  if (!validExt.includes(format?.toLowerCase())) {
    return false;
  }

  return crypto.randomBytes(2).toString('hex') + '_' + name;
};
