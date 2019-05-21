import User from '../../models/User'


describe('Routes: users', () => {

    // clean database
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            if (err) { console.log(err); }
        });
        done()
    });

    afterEach((done) => {
        User.deleteMany({}, (err) => {
            if (err) { console.log(err); }
        });
        done()
    });

    describe('POST /users with all required fields', () => {
      it('creates a new user and return it', (done) => {
          request.post("/users")
              .send({
                  name: "John",
                  email: "john@example.com",
                  password: "12345"
              })
              .expect(201)
              .end((err, res) => {
                  expect(res.body.user.name).to.eql("John");
                  expect(res.body.user.email).to.eql("john@example.com");
                  done(err);
              })
      });
    });

    describe('POST /users with missing field(s)', () => {
        it('returns an error', (done) => {
            request.post("/users")
                .send({
                    name: "John",
                    password: "12345"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.error).to.exist;
                    expect(res.body.error._message).to.be.eql("User validation failed");
                    done(err);
                })
        });
    });

    describe('POST /users with already existing email', () => {
        it('returns a mongodb duplicate key error', (done) => {
            User.create({
                name: "testname",
                email: "john@example.com",
                password: "somepassword",
            }, err => {
               if (err) { console.log(err); }
            });
            request.post("/users")
                .send({
                    name: "John",
                    email: "john@example.com",   // same email
                    password: "12345"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.error).to.exist;
                    expect(res.body.error.code).to.be.eql(11000);
                    done(err);
                })
        });
    });

    describe('POST /users/token with correct credentials', () => {
        it('returns an json web token', done => {
            request.post("/users")
                  .send({
                      name: "John",
                      email: "john@example.com",
                      password: "12345"
                  })
                  .expect(200)
                  .end(() => {
                    request.post("/users/token")
                        .send({
                            email: "john@example.com",
                            password: "12345"
                        })
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body.token).to.exist;
                            done(err);
                        })
                  })
          })
    })

    describe('POST /users/token with wrong credentials', () => {
        it('does not return a token', done => {
            request.post("/users")
                  .send({
                      name: "John",
                      email: "john@example.com",
                      password: "12345"
                  })
                  .expect(200)
                  .end(() => {
                    request.post("/users/token")
                        .send({
                            email: "john@example.com",
                            password: "wrongpassword"
                        })
                        .expect(401)
                        .end((err, res) => {
                            expect(res.body.message).to.eql("wrong user credentials")
                            done(err);
                        })
                  })
          })
    })
    
  });
