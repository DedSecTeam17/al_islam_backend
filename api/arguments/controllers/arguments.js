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
    console.log(foundArgument)

    return foundArgument
  },

  create: async ctx => {
    const { reasonings, statement, ...argument } = ctx.request.body
    console.log({ reasonings, argument })

    
    if (!statement){
      throw new Error('should contain statement')
    }
    
    // if reasoning is null or 
    let savedReason;
    if (argument.hasOwnProperty('reasoning')){
      savedReason = await strapi.query('Reasonings').findOne({ id: argument.reasoning})
    } else {
      savedReason = await strapi.query('Reasonings').create()
    }
    
    
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
      const { statement, order, ...rest } = reason

      // if id or complete premise
      if (rest.hasOwnProperty('id')) {
        const obj = {
          UsedIn: [savedReason.id]
        }
        
        const savedPremise = await strapi.query('Arguments').update( {id: rest.id} ,obj)

        arr.push({
          id: rest.id,
          order: order
        })

      } else {
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
      
    }

    if (!argument.hasOwnProperty('reasoning')){
      const t = await strapi.query('reasonings').update({ _id: savedReason.id }, {order: arr})
      console.log(t)
    }
    const algoliaArgument = {
      ...savedArgument,
      UsedInLength: savedArgument.UsedIn.length
    }
    strapi.services.algolia.saveObject(algoliaArgument, 'argument');
    // const lol = await strapi.query('Arguments').find({id: savedArgument.id})

    return savedArgument
  },
  
  update: async ctx => {
    const id = ctx.params.id
    const updateData = ctx.request.body

    if(!updateData){
      throw new Error()
    }
    
    const updatedArgument = await strapi.query('Arguments').update({ id }, updateData)
    // const { reasonings, reorder} = ctx.request.body
    // if (reasonings && reorder) {
    //   const updatedOrder = await strapi.qurey('reasonings').update({id: reason.id}, {reorder})
    // }
    strapi.services.algolia.saveObject(updatedArgument, 'argument');

    return updatedArgument
    //send to all connected users
    // strapi.emitToAllUsers(ctx.request.body)
  },

  delete: async ctx => {
    const id = ctx.params.id
    const deletedArgument = await strapi.query('Arguments').delete({ id })

    strapi.services.algolia.deleteObject(id, 'argument')
  },

  root: async ctx => {
    // const foundArgument =  await strapi.query('arguments').find({ UsedIn: { $lte: []} } )
    // const foundArgument = await strapi.query('arguments').find({ UsedIn: {$exists: true, $not: {$size: 0}}}, [
    //   { path: 'UsedIn' }
    // ])
    const foundArgument = await strapi.query('arguments').find({}, [
      { path: 'UsedIn' },
      { path: 'reasonings',
        populate: {
          path: 'premises'
        }
      }
    ])
    const arr = []
    for (const argument of foundArgument){
      if (argument.UsedIn.length === 0){
        arr.push(argument)
      }
    }
    // const foundArgument =  await strapi.query('arguments').find({ UsedIn: [] })
    console.log(arr)

    return arr
  },

  addPremise: async ctx => {
    const reasonId = ctx.params.id
    const { premise, order } = ctx.request.body

    let argument;
    if (premise.hasOwnProperty('_id')){
      argument = await strapi.query('Arguments').findOne({id: premise._id})
    }
    else {
      const obj = {
        ...premise,
        UsedIn: [reasonId]
      }
      argument = await strapi.query('Arguments').create(obj)
    }

    // const obj = {
    //   ...premise,
    //   UsedIn: [reasonId]
    // }
    // const argument = await strapi.query('Arguments').create(obj)

    const reason = await strapi.query('reasonings').findOne({ id: reasonId })

    reason.order.push({id: argument.id , order: order})
    reason.premises.push(argument.id)
    
    const updatedReason = await strapi.query('reasonings').update({ id: reasonId }, { order: reason.order, premises: reason.premises})

    return updatedReason
  },

  addPremiseToArgument: async ctx => {
    const argumentId = ctx.params.id
    const { premise, order } = ctx.request.body

    const savedReason = await strapi.query('Reasonings').create()

    // originArgument = await strapi.query('Arguments').findOne({id: argumentId})
    
    let argument;
    if (premise.hasOwnProperty('_id')){
      argument = await strapi.query('Arguments').findOne({id: premise._id})
    } else {
      const obj = {
        ...premise,
        UsedIn: [savedReason.id]
      }
      argument = await strapi.query('Arguments').create(obj)
    }
    console.log({argument})
    
    originArgument = await strapi.query('Arguments').update({id: argumentId}, {reasonings: [savedReason.id]})

    savedReason.order.push({id: argument.id , order: order})
    savedReason.premises.push(argument.id)
    const updatedReason = await strapi.query('Reasonings').update({ id: savedReason.id }, { order: savedReason.order, premises: savedReason.premises })

    return updatedReason
  }
};

// id: reasongig id

// {
//   premise: {
//     statement: "lol"
//   },
//   order: 5
// }
