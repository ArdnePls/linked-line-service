const request = require('supertest');
const app = require('../app');

describe('/ POST', () => {
  it("Should success because file could be written and line starts with 00", () =>
    request(app)
        .post('/')
        .send({sentence: "Hello world"})
        .expect(201)
        .then(response => {
            expect(response.text).toMatch(',Hello world,');
            const sentences = (response.text.split('\n'));
            sentences.pop();
            expect(sentences.length).toBe(1);
            expect(sentences[0]).hasHashExpectedNonce();
        })
  );

  it("Should fail because sentence is empty", () =>
    request(app)
        .post('/')
        .send({})
        .expect(400)
        .then(response => expect(response.body.message).toMatch('Sentence field is empty'))
  );

  it("Should success because file could be written and all lines starts with 00", () => 
    request(app)
        .post('/')
        .send({sentence: "Hello world"})
        .expect(201)
        .then(() =>
            request(app)
                .post('/')
                .send({sentence: "Goodbye world"})
                .expect(201)
                .then(response => {
                    expect(response.text).toMatch(',Hello world,');
                    expect(response.text).toMatch(',Goodbye world,');
                    const sentences = (response.text.split('\n'));
                    sentences.pop();
                    expect(sentences.length).toBe(2);
                    expect(sentences[0]).hasHashExpectedNonce();
                    expect(sentences[1]).hasHashExpectedNonce();
                    expect(sentences).linesAreLinked();
                })
        )
  );
});