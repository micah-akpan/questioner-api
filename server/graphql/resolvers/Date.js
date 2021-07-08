import { GraphQLScalarType } from 'graphql';

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'UTC number of milliseconds since midnight Jan 1 1970 as in JS date',
    parseValue(value) {
      return new Date(value);
    },

    serialize(value) {
      // Convert Date to number primitive .getTime() or .valueOf()
      // value sent to the client
      return value instanceof Date ? value.valueOf() : value;
    },
  }),

};
