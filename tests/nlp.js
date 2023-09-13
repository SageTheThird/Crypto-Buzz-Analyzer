const NLP = require('./../helpers/nlp');
const nlp = new NLP();

const text = `Congratulations to all the winners. May the opportunity be beneficial to you and humanity. `;
const sentiment = nlp.analyzeText(text);

console.log(`The sentiment of the text is: ${sentiment}`);

// TODO: more tests
