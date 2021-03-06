export default {
  text: `CREATE TABLE IF NOT EXISTS "User" (
      id SERIAL PRIMARY KEY,
      firstname text NOT NULL,
      lastname text NOT NULL,
      othername text,
      email text NOT NULL,
      password text NOT NULL,
      phoneNumber BIGINT,
      username text,
      birthday DATE,
      registered DATE DEFAULT NOW(),
      isAdmin boolean DEFAULT FALSE,
      bio text,
      avatar text,
      UNIQUE(email, username)
    )`
};
