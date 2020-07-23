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
    return strapi.query('Arguments').find(ctx.query, [
      {
        path: 'reasonings',
        populate: {
          path: 'premises'
        }
      }
    ])
  },

  create: async ctx => {
    const { reasonings, ...argument } = ctx.request.body
    console.log({ reasonings, argument })

    
    const savedReason = await strapi.query('Reasonings').create()

    const a = {
      ...argument,
      reasonings: [savedReason.id]
    }

    const savedArgument = await strapi.query('Arguments').create(a)
    
    const arr = []
    for (const reason of reasonings) {
      console.log({reason})
      const { statement, order } = reason
      
      const t = {
        statement: statement,
        usedIn: [savedReason.id]
      }
      
      const savedPremise = await strapi.query('Arguments').create(t)
      arr.push({
        id: savedPremise.id,
        order: order
      })
      console.log({savedPremise})
    }

    await strapi.query('reasonings').update({ _id: savedReason.id }, { premises: [savedArgument.id], order: arr})
    const lol = await strapi.query('Arguments').find({id: savedArgument.id})
    // console.log(lol)

    ctx.response.send(lol)
  },
  
  update: async ctx => {
    const id = ctx.params
    const updateData = ctx.request.body

    if(!updateData){
      throw new Error()
    }

    const updatedArgument = await strapi.query('Argument').update({ id }, updateData)
    //send to all connected users
    // strapi.emitToAllUsers(ctx.request.body)
  }
};
