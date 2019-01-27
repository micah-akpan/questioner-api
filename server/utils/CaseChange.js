/* eslint-disable */
import { wordToPosition } from './index';
 
class CaseChange {
  constructor(words) {
    this._words = words;
  }

  toCamelCase(word) {
    const wordHash = wordToPosition(this._words, word);

    let newStr = '';
    for (let prop in wordHash) {
      if (Object.prototype.hasOwnProperty.call(wordHash, prop)) {
        newStr += wordHash[prop] === 0 ? prop : `${prop[0].toUpperCase()}${prop.substring(1)}`;
      }
    }

    return newStr;
  }
}

export default CaseChange;