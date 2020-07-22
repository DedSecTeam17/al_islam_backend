module.exports = {
  definition: `
  input reasoningInput {
    statement: String!,
    order: Int
  }
`,
  mutation: `
    createArgumentt( statement: String, reasonings: [reasoningInput]): Argument
  `,
  resolver: {
    Mutation: {
      createArgumentt: {
        description: 'Return the argument',
        resolver: 'argument.create'
      }
    }
  }
}