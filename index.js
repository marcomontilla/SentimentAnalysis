const prompt = require("prompt");
const fs = require("fs");

const { analyze } = require("./lib/sentiment")();

const fileName =
  Math.random()
    .toString(36)
    .substr(2, 9) + ".json";

prompt.start();

prompt.get(["phrase"], (err, result) => {
  const {
    wordCount,
    totalScore,
    comparative,
    unknown,
    positive,
    negative,
    calculation
  } = analyze(result.phrase);

  const jsonData = {
    text: result.phrase,
    wordCount,
    totalScore,
    comparative,
    unknown,
    positive,
    negative,
    calculation
  };

  fs.writeFile(`./results/${fileName}`, JSON.stringify(jsonData), err => {
    if (err) {
      console.log(err);
    }
  });
});
