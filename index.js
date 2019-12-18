const prompt = require('prompt');
const fs = require('fs');

const { analyze, classify } = require("./lib/sentiment")();

prompt.start();

prompt.get(['phrase'], (err, result) => {
  const {
    wordCount,
    score,
    comparative,
    unknown,
    positive,
    negative,
    calculation
  } = analyze(result.phrase);

  const jsonData ={
    classification: classify(score),
    wordCount,
    score,
    comparative,
    unknown,
    positive,
    negative,
    calculation
  };

  const fileName = Math.random().toString(36).substr(2, 9) + '.json';
  console.log(fileName);

  fs.writeFile(`./results/${fileName}`, JSON.stringify(jsonData), (err) => {
    if (err) {
      console.log(err);
    }
  });

}); 
