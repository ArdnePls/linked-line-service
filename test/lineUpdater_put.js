const request = require('supertest');
const app = require('../app');

describe('/ PUT', () => {
  it("Should fail because sentence is empty", () =>
    request(app)
        .put('/')
        .send({index: 1})
        .expect(400)
        .then(response => expect(response.body.message).toMatch('Sentence field is empty'))
  );

  
  it("Should fail because index is empty", () =>
    request(app)
        .put('/')
        .send({sentence: "Hello World"})
        .expect(400)
        .then(response => expect(response.body.message).toMatch(/Index field is empty/))
  );

  it("Should fail because index is greater than file length", () =>
    request(app)
        .post('/')
        .send({sentence: "Hello World"})
        .then(() =>
            request(app)
                .put('/')
                .send({sentence: "Hello World", index: 5})
                .expect(400)
                .then(response => expect(response.text).toMatch(/Index value should be between 1 and/)))
  );

  it("Should fail because index is less than 1", () =>
    request(app)
        .post('/')
        .send({sentence: "Hello World"})
        .then(() =>
            request(app)
                .put('/')
                .send({sentence: "Hello World", index: 0})
                .expect(400)
                .then(response => expect(response.text).toMatch(/Index value should be between 1 and/)))
  );

  it("Should fail because file is empty", () =>
    request(app)
        .put('/')
        .send({sentence: "Hello World", index: 1})
        .expect(400)
        .then(response => expect(response.text).toMatch(/There are no lines to update./))
  );

  it("Should success because file 1st line could be updated and all lines are linked and data is persisted", () =>
    request(app)
        .post('/')
        .send({sentence: "Hello world"})
        .then(() => 
            request(app)
                .post('/')
                .send({sentence: "Goodbye world"})
                .then(() =>
                    request(app)
                        .put('/')
                        .send({sentence: "Good morning world", index: 1})
                        .expect(200)
                        .then(response => {
                            const sentences = (response.text.split('\n'));
                            sentences.pop();
                            expect(sentences[0]).toMatch(',Good morning world,');
                            expect(sentences[1]).toMatch(',Goodbye world,');
                            expect(sentences.length).toBe(2);
                            expect(sentences[0]).hasHashExpectedNonce();
                            expect(sentences[1]).hasHashExpectedNonce();
                            expect(sentences).linesAreLinked();
                        })
                )
        )
  );

  it("Should success because file could be updated and all lines are linked and previous data is not modified", () => {
    return request(app)
        .post('/')
        .send({sentence: "Hello world"})
        .then(() => {
            return request(app)
                .post('/')
                .send({sentence: "Goodbye world"})
                .then((resPost) => {
                    const sentenceToPersist = (resPost.text.split('\n'))[0];
                    return request(app)
                    .put('/')
                    .send({sentence: "Hello world", index: 2})
                    .expect(200)
                    .then(response => {
                        const sentences = (response.text.split('\n'));
                        sentences.pop();
                        expect(sentences[0]).toMatch(sentenceToPersist);
                        expect(sentences[1]).toMatch(',Hello world,');
                        expect(sentences[1]).hasHashExpectedNonce();
                        expect(sentences).linesAreLinked();
                    })
                })
        })
  });
});