module.exports = opts => {
  opts = opts || {};
  opts.words = opts.words || {};
  opts.tokenize = opts.tokenize || (el => el.replace(/\W/g, ""));

  /**
   * Classify the phrase evaluating the content.
   *
   * @param {Object} dict Object with the words list
   * @param {RegExp} negate Negations
   *
   * @return {Object} Return an object with the Score and the list of the found words
   */
  const analysis = (dict, negate, affirm) => str => {
    const unknown = [];
    const positive = [];
    const negative = [];
    const calculation = [];
    const cleanString = str.toLowerCase().split(" ");

    const score = cleanString.map(opts.tokenize).reduce(
      (acc, word) => {
        // Calculate the score of the word
        var score = negate.test(acc.prev) ? -dict[word] : dict[word];
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

    wordCount = 0;

    cleanString.map(() => wordCount++);

    const comparative = score / wordCount;

    return {
      score,
      comparative,
      unknown,
      positive,
      negative,
      wordCount,
      calculation
    };
  };

  const analyze = (() => {
    const dict = Object.assign(opts.words, require("./afinn.json"));
    const negate = new RegExp(/^(not|don't|dont|no|nope|nein|nicht|keine)$/); // Negation German / English
    const affirm = new RegExp(/^(more|very|a lot|mega)$/); // Negation German / English
    return analysis(dict, negate, affirm);
  })();

  const classify = score => {
    if (score > 0 && score <= 2) {
      return `It's Positive`;
    } else if (score > 2) {
      return `It's Very Positive`;
    } else if (score < 0 && score >= -2) {
      return `It's Negative`;
    } else if (score < -2) {
      return `It's Very Negative`;
    } else {
      return `It's Neutral`;
    }
  };

  return {
    analyze,
    classify
  };
};
