describe('Routes: Index', () => {
  describe('GET /', () => {
    it('returns the welcome message', (done) => {
        request.get("/")
            .expect(200)
            .end((err, res) => {
                const expected = { message: "Welcome to the Node.js social site REST API"};
                expect(res.body).to.eql(expected);
                done(err);
            })
    })
  })
});
