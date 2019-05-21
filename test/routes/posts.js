import jwt from 'jwt-simple'

import Post from '../../models/Post'
import User from '../../models/User'
import config from '../../config/config'


describe('Routes: posts', () => {

    // create user, token
    let token, someUser;
    const newUser = new User({
        email: "test@example.com",
        name: "test",
        password: "12345"
    });
    newUser.save((err, user) => {
        if (err) { console.log(err); }
        token = jwt.encode({ id: user._id }, config.jwtSecret )
        someUser = user;
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
      it('creates a new post and return it', done => {
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

    describe('POST /posts - with wrong auth token', () => {
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

    describe('GET /posts', () => {
      it('returns a list of all posts', done => {
        // create some posts 
        const post1 = new Post({ title: 'title 1', body: 'body 1'})
        post1.createdBy = someUser
        post1.save().then(console.log('post created'))

        const post2 = new Post({ title: 'title 2', body: 'body 2'})
        post2.createdBy = someUser
        post2.save().then(console.log('post created'))

        request.get("/posts")
          .expect(200)
          .end((err, res) => {
            expect(res.body.posts).to.exist;
            expect(res.body.posts.length).to.eql(2);
            done(err);
        })
      })

      it('returns a single post - when valid id is provided', done => {
        // create some posts 
        const post1 = new Post({ title: 'title 1', body: 'body 1'})
        post1.createdBy = someUser
        post1.save().then(console.log('post created'))

        const post2 = new Post({ title: 'title 2', body: 'body 2'})
        post2.createdBy = someUser
        post2.save().then(console.log('post created'))

        request.get(`/posts/${post1._id}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.post).to.exist;
            expect(res.body.post.title).to.eql(post1.title);
            expect(res.body.post.body).to.eql(post1.body);
            done(err);
        })
      })

    })
    
})
