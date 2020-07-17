'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
//    find: ctx => {
//        return strapi.query('argument').find(ctx.query, [
//            'reasonings','reasonings.premises'
//        ]);
//      },
find: ctx => {
    return strapi.query('argument').find(ctx.query, [
      {
        path: 'reasonings',
        populate: {
          path: 'premises',
        },
      },
    ]);
  },
};
