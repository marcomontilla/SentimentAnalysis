const prompt = require('prompt');
const fs = require('fs');

const { analyze, classify } = require("./sentiment")();

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

  console.log(jsonData)

  fs.writeFile("results.json", JSON.stringify(jsonData), function(err) {
    if (err) {
      console.log(err);
    }
  });

}); 
