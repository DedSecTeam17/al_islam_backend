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
  find: async ctx => {
    const foundArgument =  await strapi.query('arguments').find({}, [
      {
        path: 'reasonings',
        populate: {
          path: 'premises'
        }
      }
    ])

    return foundArgument
  },

  findOne: async ctx => {
    const foundArgument = await strapi.query('Arguments').findOne({id: ctx.params.id}, [
      {
        path: 'reasonings',
        populate: {
          path: 'premises'
        }
      }
    ])

    return foundArgument
  },

  create: async ctx => {
    const { reasonings, statement, ...argument } = ctx.request.body
    console.log({ reasonings, argument })

    if (!statement){
      throw new Error('should contain statement')
    }

    
    const savedReason = await strapi.query('Reasonings').create()
    
    let a;

    if (reasonings && reasonings.length > 0){
      a = {
        statement,
        reasonings: [savedReason.id]
      }
    } else {
      a = {
        statement,
        reasonings: []
      }
    }
    console.log(a)

    const savedArgument = await strapi.query('Arguments').create(a)
    console.log({savedArgument})
    
    const arr = []
    for (const reason of reasonings) {
      const { statement, order } = reason
      
      const obj = {
        statement: statement,
        UsedIn: [savedReason.id]
      }
      
      const savedPremise = await strapi.query('Arguments').create(obj)
      arr.push({
        id: savedPremise.id,
        order: order
      })
      console.log({savedPremise})
    }

    const t = await strapi.query('reasonings').update({ _id: savedReason.id }, {order: arr})
    console.log(t)
    // const lol = await strapi.query('Arguments').find({id: savedArgument.id})

    return savedArgument
  },
  
  update: async ctx => {
    const id = ctx.params
    const updateData = ctx.request.body

    if(!updateData){
      throw new Error()
    }

    const updatedArgument = await strapi.query('Arguments').update({ id }, updateData)
    //send to all connected users
    // strapi.emitToAllUsers(ctx.request.body)
  }
};
