const {
  NODE_ENV,
  APP_DEV_PORT,
  AWS_S3_BUCKET_NAME
} = process.env;

export const appPath = NODE_ENV === 'production' ? './dist' : './src';
export const APP_PORT = APP_DEV_PORT || 4000;
export const GRAPHQL_PATH = '/graphql';
export const GRAPHIQL_PATH = '/graphiql';
export const useGraphqlPlayground = true;

export const BASE_S3_URI = `https://${AWS_S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com`;
