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
            expect(res.body.post.createdOn).to.exist;
            expect(res.body.post.modifiedOn).to.exist;
            done(err);
         })
      })
    })

    describe('POST /posts - with wrong auth token', () => {
        it('does not create post', done => {
          request.post("/posts")
            .set("Authorization", `Bearer some.wrong.tokne`)
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

        const post2 = new Post({ title: 'title 2', body: 'body 2'})
        post2.createdBy = someUser

        let postsArray = [post1, post2]

        Post.create(postsArray).then(() => {
          request.get("/posts")
            .expect(200)
            .end((err, res) => {
              expect(res.body.posts).to.exist;
              expect(res.body.posts.length).to.eql(2);
              done(err);
        })
        }).catch(err => {
          console.log('error saving posts ',err)
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

    describe('POST /posts/<post-id>/comments', () => {
      it('creates a new comment', done => {
        // create a new post
        const post = new Post({ title: 'some title', body: 'body comment'})
        post.createdBy = someUser
        post.save().then(post => {
          request.post(`/posts/${post._id}/comments`)
            .set("Authorization", `Bearer ${token}`)
            .send({ body: "some random comment" })
            .expect(201)
            .end((err, res) => {
              expect(res.body.message).to.eql("comment created successfully");
              expect(res.body.comments.length).to.eql(1);
              expect(res.body.comments[0].body).to.eql("some random comment");
              done(err);
            })
        })
      })
    })

    describe('PUT /posts/<post-id>', () => {
      it('should update a post', done => {
        // create a post 
        const post = new Post({ title: 'post title', body: 'post body'})
        post.createdBy = someUser
        post.save().then(post => {
            request.put(`/posts/${post._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
              title: "post title **updated",
              body: "post body"
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.updatedPost).to.exist;
              const { modifiedOn, createdOn } = res.body.updatedPost
              expect(res.body.message).to.eql("Post updated successfully");
              expect(res.body.updatedPost.title).to.eql("post title **updated");
              modifiedOn.should.not.equal(createdOn)
              done(err);
          })
        })
      })
    })

    describe('PUT /posts/<post-id> -- unauthenticated', () => {
      it('returns unauthenticated', done => {
        // create a new post
        const post = new Post({ title: 'some title', body: 'body comment'})
        post.createdBy = someUser
        post.save().then(post => {
          request.put(`/posts/${post._id}`)
            .set("Authorization", "Bearer some.wrong.token")
            .expect(401)
            .end((err, res) => done(err))
        })        
      })
    })
     
    describe('DELETE /posts/<post-id> -- owner of post', () => {
      it('deletes a post', done => {
        // create a new post
        const post = new Post({ title: 'some title', body: 'body comment'})
        post.createdBy = someUser
        post.save().then(post => {
          request.delete(`/posts/${post._id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204)
            .end((err, res) => done(err))
        })        
      })
    })
    
    describe('DELETE /posts/<post-id> -- non owner of post', () => {
      it('does not remove a post', done => {
        // create a new post
        const post = new Post({ title: 'some title', body: 'body comment'})
        post.createdBy = someUser

        const testUser = new User({
          email: "johndoe@example.com",
          name: "john doe",
          password: "password"
        });

        let nonOwnerToken;

        // create a new user and token
        testUser.save((err, user) => {
          if (err) { console.log(err); }
          nonOwnerToken = jwt.encode({ id: user._id }, config.jwtSecret )
        })

        post.save().then(post => {
          request.delete(`/posts/${post._id}`)
            .set("Authorization", `Bearer ${nonOwnerToken}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.error).to.exist;
              expect(res.body.error).to.eql("only owner of post can remove it")
              done(err)
            })
        })        
      })
    })
})
