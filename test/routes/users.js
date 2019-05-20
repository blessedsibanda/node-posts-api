import User from '../../models/User'


describe('Routes: Users', () => {

    // clear the database
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            if (err) { console.log(err); }
        });
        done()
    });
    describe('POST /users', () => {
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
      })
    })
  });
