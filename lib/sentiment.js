const tokenize = require("./tokenize");
const dict = require("./afinn.json");
const negate = new RegExp(/^(not|don't|dont|no|nope|nein|nicht|keine)$/); // Negation German / English
const affirm = new RegExp(/^(more|very|a lot|mega|so)$/); // Affirmation

module.exports = () => {
  /**
   * Classify the phrase evaluating the content.
   *
   * @param {Object} dict Object with the words list
   * @param {RegExp} negate Negations
   * @return {Object}   Return an object with the Score and the list of the found words
   */
  const analysis = (dict, negate, affirm) => str => {
    const unknown = [];
    const positive = [];
    const negative = [];
    const calculation = [];
    var wordCount = 0;

    const totalScore = str
      .split(" ")
      .map(el => {
        wordCount++;
        return tokenize(el);
      })
      .reduce(
        (acc, word) => {
          // Calculate the score of the word
          var score;
          score = negate.test(acc.prev) ? -dict[word] : dict[word];
          score = affirm.test(acc.prev) ? score * 2 - score * 0.5 : score;

          // Create an array of objects for words with value
          var wordArray = {};
          wordArray[word] = dict[word];
          dict[word] ? calculation.push(wordArray) : null;

          // Filter Positive, negative, and unknown words
          if (dict[word] > 0) {
            positive.push(word);
          } else if (dict[word] < 0) {
            negative.push(word);
          } else {
            unknown.push(word);
          }

          return {
            sum: acc.sum + (score || 0),
            prev: word
          };
        },
        { sum: 0, prev: "" }
      ).sum;

    const comparative = totalScore / wordCount;

    return {
      totalScore,
      comparative,
      unknown,
      positive,
      negative,
      wordCount,
      calculation
    };
  };

  const analyze = (() => analysis(dict, negate, affirm))();

  return {
    analyze
  };
};
