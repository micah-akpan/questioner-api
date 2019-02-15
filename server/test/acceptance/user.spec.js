import 'chai/register-should';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { app } from '../../app';
import db from '../../db';
import { createTestToken } from '../../utils';

describe.only('User API', () => {
  const agent = request(app);
  const testUser = {
    email: 'testuser@gmail.com',
    password: 'testuser1234',
    firstname: 'Test',
    lastname: 'User'
  };

  const testToken = createTestToken({});
  const adminTestToken = createTestToken({ admin: true });

  before('Setup', async () => {
    await db.dropTable({ tableName: 'Comment', });
    await db.dropTable({ tableName: 'Rsvp' });
    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: '"User"' });

    await db.createTable('User');
  });

  describe('POST /auth/signup', () => {
    describe('handle valid/complete data', () => {
      it('should create a new user', (done) => {
        agent
          .post('/api/v1/auth/signup')
          .send(testUser)
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(201);
            res.body.data.should.be.an('array');
            res.body.data[0].user.email.should.equal('testuser@gmail.com');
            done();
          });
      });
    });

    afterEach(async () => {
    });

    describe('handle invalid/incomplete data', () => {
      beforeEach(async () => {
        await db.queryDb({
          text: `INSERT INTO "User" (firstname,lastname,email,password)
                 VALUES ($1, $2, $3, $4)
                `,
          values: ['user1', 'user1', 'user1@email.com', 'user1234']
        });
      });

      it('should return an error if user already exist', (done) => {
        agent
          .post('/api/v1/auth/signup')
          .send({
            email: 'user1@email.com',
            password: 'user1234',
            firstname: 'user1',
            lastname: 'user1'
          })
          .expect(409)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(409);
            res.body.should.have.property('error');
            res.body.error.should.equal('The email you provided is already used by another user');
            done();
          });
      });
    });
  });

  describe('POST /auth/login', () => {
    beforeEach('Add Test User', async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('testuser1234', salt);

      const query = {
        text: `INSERT INTO "User" (firstname, lastname, email, password)
        VALUES ('testuser', 'testuser', 'testuser@gmail.com', $1)`,
        values: [hashedPassword]
      };

      await db.queryDb(query);
    });
    it('should login a user', (done) => {
      agent
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@gmail.com',
          password: 'testuser1234'
        })
        .expect(201, done);
    });

    it('should not login an unregistered user', (done) => {
      agent
        .post('/api/v1/auth/login')
        .send({
          email: 'nonuser1@gmail.com',
          password: 'testuser1234'
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(401);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe('PATCH /users/:userId', () => {
    before(async () => {
      await db.dropTable({ tableName: '"User"' });
      await db.createTable('User');
    });

    describe('handle valid update request', () => {
      beforeEach(async () => {
        await db.queryDb({
          text: `INSERT INTO "User" (firstname, lastname, email, password, username)
                 VALUES ('user1','user1', 'user1@email.com', 'user1234', 'usera')`
        });
      });

      it('should update user\'s profile', (done) => {
        agent
          .patch('/api/v1/users/1')
          .set('Authorization', `Bearer ${testToken}`)
          .send({
            firstname: 'userA'
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(200);
            res.body.data.should.be.an('array');
            res.body.data[0].firstname.should.equal('userA');
            done();
          });
      });

      after(async () => {
        await db.dropTable({ tableName: '"User"' });
      });
    });

    describe('handle invalid request', () => {
      before(async () => {
        await db.createTable('User');
        await db.queryDb({
          text: `INSERT INTO "User" (firstname, lastname, email, password, username)
                 VALUES ('user1','user1', 'user1@email.com', 'user1234', 'usera'),
                 ('user2', 'user2', 'user2@email.com', 'user2222', 'userb')`
        });
      });
      it('should not update another user\'s profile', (done) => {
        const authToken = createTestToken({ userId: 2 });
        agent
          .patch('/api/v1/users/1')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            username: 'new username'
          })
          .expect(422, done);
      });

      it('should not update user\'s email if user with email exist', (done) => {
        const authToken = createTestToken({ userId: 2 });
        agent
          .patch('/api/v1/users/2')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            email: 'user1@email.com'
          })
          .expect(409, done);
      });

      it('should not update user\'s username if user with username exist', (done) => {
        const authToken = createTestToken({ userId: 2 });
        agent
          .patch('/api/v1/users/2')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            username: 'usera'
          })
          .expect(409, done);
      });
    });
  });

  describe('GET /users', () => {
    before(async () => {
      await db.dropTable({ tableName: '"User"' });
      await db.createTable('User');
    });

    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO "User" (firstname, lastname, email, password)
               VALUES ('user1', 'user1', 'user1@email.com', 'user1234')`
      });
    });
    it('should return all non-admin registered users', (done) => {
      agent
        .get('/api/v1/users')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .expect(200, done);
    });
  });

  describe('GET /users/<user-id>', () => {
    before(async () => {
      await db.dropTable({ tableName: '"User"' });
      await db.createTable('User');
    });

    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO "User" (firstname, lastname, email, password)
               VALUES ('user1', 'user1', 'user1@email.com', 'user1234')`
      });
    });
    it('should return a registered user', (done) => {
      agent
        .get('/api/v1/users/1')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .expect(200, done);
    });
  });

  describe('DELETE /users/<user-id>', () => {
    before(async () => {
      await db.dropTable({ tableName: '"User"' });
      await db.createTable('User');
    });

    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO "User" (firstname, lastname, email, password)
               VALUES ('user1', 'user1', 'user1@email.com', 'user1234')`
      });
    });

    it('should delete/deactivate a user account', (done) => {
      agent
        .delete('/api/v1/users/1')
        .set({ Authorization: `Bearer ${testToken}` })
        .expect(200, done);
    });

    it('should not delete/deactivate a non-existing user account', (done) => {
      agent
        .delete('/api/v1/users/9999999')
        .set({ Authorization: `Bearer ${testToken}` })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });
  });
  after('Teardown', async () => {
    await db.dropTable({ tableName: 'Comment', });
    await db.dropTable({ tableName: 'Rsvp' });
    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: '"User"' });
  });
});
