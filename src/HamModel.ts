type WordMap = {
  [word: string]: {
    hamCount: number,
    probabilityGivenHam: number,
    spamCount: number,
    probabilityGivenSpam: number,
  },
};

export type ModelTrainingResults = {
  totalHamMessageCount: number,
  totalSpamMessageCount: number,
  mostFrequentSpamWords: { word: string, spamCount: number }[],
};

export type ModelTestingResults = {
  truePositives: number,
  falsePositives: number,
  trueNegatives: number,
  falseNegatives: number,
};

export class HamModel {

  private readonly alpha = 1;

  private wordMap: WordMap = {};

  private totalHamMessageCount = 0;
  private totalSpamMessageCount = 0;

  private totalHamWordCount = 0;
  private totalSpamWordCount = 0;

  private priorHamProbability = 0;
  private priorSpamProbability = 0;

  private trainingCompleted = false;
  private testingCompleted = false;

  train(trainingDataRows: string[][]): ModelTrainingResults {
    if (this.trainingCompleted) {
      throw new Error('Training already completed');
    }

    const results: ModelTrainingResults = {
      totalHamMessageCount: 0,
      totalSpamMessageCount: 0,
      mostFrequentSpamWords: [],
    };

    for (const [tag, message] of trainingDataRows) {
      if (tag === 'ham') {
        this.totalHamMessageCount++;
      } else if (tag === 'spam') {
        this.totalSpamMessageCount++;
      }

      const words = this.parseWords(message);

      for (const word of words) {
        if (!(word in this.wordMap)) {
          this.wordMap[word] = {
            hamCount: this.alpha,
            probabilityGivenHam: 0,
            spamCount: this.alpha,
            probabilityGivenSpam: 0,
          };
          this.totalHamWordCount += this.alpha;
          this.totalSpamWordCount += this.alpha;
        }
        if (tag === 'ham') {
          this.wordMap[word].hamCount++;
          this.totalHamWordCount++;
        } else if (tag === 'spam') {
          this.wordMap[word].spamCount++;
          this.totalSpamWordCount++;
        }
      }
    }

    const totalMessageCount = this.totalHamMessageCount + this.totalSpamMessageCount;
    this.priorHamProbability = this.totalHamMessageCount / totalMessageCount;
    this.priorSpamProbability = this.totalSpamMessageCount / totalMessageCount;

    const wordsWithSpamCount: { word: string, spamCount: number }[] = [];

    for (const word in this.wordMap) {
      this.wordMap[word].probabilityGivenHam = this.wordMap[word].hamCount / this.totalHamWordCount;
      this.wordMap[word].probabilityGivenSpam = this.wordMap[word].spamCount / this.totalSpamWordCount;
      wordsWithSpamCount.push({ word, spamCount: this.wordMap[word].spamCount - this.alpha });
    }

    wordsWithSpamCount.sort((a, b) => b.spamCount - a.spamCount);
    results.mostFrequentSpamWords = wordsWithSpamCount.slice(0, 10);

    results.totalHamMessageCount = this.totalHamMessageCount;
    results.totalSpamMessageCount = this.totalSpamMessageCount;

    this.trainingCompleted = true;
    return results;
  }

  test(testingDataRows: string[][]): ModelTestingResults {
    if (!this.trainingCompleted) {
      throw new Error('Training not completed');
    }
    if (this.testingCompleted) {
      throw new Error('Testing already completed');
    }

    const results: ModelTestingResults = {
      truePositives: 0,
      falsePositives: 0,
      trueNegatives: 0,
      falseNegatives: 0,
    };

    for (const [tag, message] of testingDataRows) {
      const predictedHam = this.predictIsHam(message);
      if (predictedHam && tag === 'ham') results.truePositives++;
      if (predictedHam && tag === 'spam') results.falsePositives++;
      if (!predictedHam && tag === 'ham') results.falseNegatives++;
      if (!predictedHam && tag === 'spam') results.trueNegatives++;
    }

    this.testingCompleted = true;
    return results;
  }

  predictIsHam(message: string): boolean {
    if (!this.trainingCompleted) {
      throw new Error('Training not completed');
    }

    const words = this.parseWords(message);

    let hamScore = this.priorHamProbability;
    for (const word of words) {
      if (word in this.wordMap) {
        hamScore *= this.wordMap[word].probabilityGivenHam;
      }
    }

    let spamScore = this.priorSpamProbability;
    for (const word of words) {
      if (word in this.wordMap) {
        spamScore *= this.wordMap[word].probabilityGivenSpam;
      }
    }

    return hamScore > spamScore;
  }

  private parseWords(message: string): string[] {
    return (message.match(/\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g) ?? [])
      .map(word => word.toLocaleLowerCase());
  }

}
