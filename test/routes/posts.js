import jwt from 'jwt-simple'

import Post from '../../models/Post'
import User from '../../models/User'
import config from '../../config/config'


describe('Routes: posts', () => {

    // create user, token
    let token;
    const newUser = new User({
        email: "test@example.com",
        name: "test",
        password: "12345"
    });
    newUser.save((err, user) => {
        if (err) { console.log(err); }
        token = jwt.encode({ id: user._id }, config.jwtSecret )
    })

    // clean database
    beforeEach((done) => {
        Post.deleteMany({}, (err) => {
            if (err) { console.log(err); }
        });
        done()
    });

    afterEach((done) => {
        Post.deleteMany({}, (err) => {
            if (err) { console.log(err); }
        });
        done()
    });

    describe('POST /posts - with authenticated user', () => {
      it('creates a new post', done => {
        request.post("/posts")
          .set("Authorization", `Bearer ${token}`)
          .send({
            title: "post title",
            body: "post body"
          })
          .expect(201)
          .end((err, res) => {
            expect(res.body.message).to.eql("Post created successfully");
            expect(res.body.post.createdBy).to.exist;
            expect(res.body.post.createdBy).to.exist;
            expect(res.body.post.modifiedOn).to.exist;
            done(err);
         })
      })
    })

    describe('POST /posts - without authentication', () => {
        it('does not create post', done => {
          token = 'some.wrong.token'
          request.post("/posts")
            .set("Authorization", `Bearer ${token}`)
            .send({
              title: "post title",
              body: "post body"
            })
            .expect(401)
            .end((err, res) => {
              done(err);
           })
        })
      })
    
})
