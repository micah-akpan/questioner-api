export const appPath = process.env.NODE_ENV === 'production' ? './dist' : './src';
export const APP_PORT = process.env.APP_PORT || 4000;
export const GRAPHQL_PATH = '/graphql';
export const GRAPHIQL_PATH = '/graphiql';
export const useGraphqlPlayground = true;
