import User from '../../models/User'


describe('Routes: Users', () => {

    // clear the database
    beforeEach((done) => {
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
              .expect(200)
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
        it('returns a mongo duplicate key error', (done) => {
            User.create({
                name: "John",
                email: "john@example.com",
                password: "12345",
            }, err => {
               if (err) { console.log(err); }
            });
            request.post("/users")
                .send({
                    name: "John",
                    email: "john@example.com",
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
  });
