'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = (cb) => {
  const io = require('socket.io')( strapi.server)

  io.on('connection', function (socket) {
    console.log('connected')
  })

  strapi.io = io
};
