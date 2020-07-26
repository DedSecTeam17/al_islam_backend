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

module.exports = () => {
  const io = require('socket.io')( strapi.server)
  const users = []

  io.on('connection', function (socket) {
    console.log('connected')
    socket.user_id = (Math.random() * 100000000000000)
    users.push(socket)

    socket.on('disconnect', () => {
      users.forEach((user, i) => {
        // delete saved user when they disconnect
        if(user.user_id === socket.user_id) users.splice(i, 1);
      })
    })
    strapi.emitToAllUsers = change => io.emit('changed', change)
  })

  strapi.io = io
};
