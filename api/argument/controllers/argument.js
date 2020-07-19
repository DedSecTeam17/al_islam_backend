'use strict'

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
          path: 'premises'
        }
      }
    ])
  },

  create: async ctx => {
    const { reasonings, ...argument } = ctx.request.body
    console.log({ reasonings, argument })

    
    const savedReason = await strapi
    .query('Reasoning').create()
    // .create({
    //   premise: { argument: savedArgument.id, reasoning: reasonings }
    // })

    const a = {
      ...argument,
      reasonings: [savedReason.id]
    }

    const savedArgument = await strapi.query('Argument').create(a)
    await strapi.query('reasoning').update({ _id: savedReason.id }, { premises: [savedArgument.id]})

    for (const reason of reasonings) {
      const { statement, ...pemises } = reason

      const savedPremise = await strapi.query('Argument').create({ statement })
    }

    ctx.response.send({ saved: true })
  },
  
  update: async ctx => {
    const id = ctx.params
    const updateData = ctx.request.body

    const updatedArgument = await strapi.query('Argument').update({ id }, updateData)
  }
}
