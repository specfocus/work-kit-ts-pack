import { Scanner } from './Scanner';
import { Token } from './Scanner';
import { ParseOptions } from './options';
import isQuote from './isQuote';
import isEscapeCharacter from './isEscapeCharacter';

export interface DataBetweenQuotes {
  foundClosingQuote: boolean;
  col: string;
}

const gatherDataBetweenQuotes = (scanner: Scanner, options: ParseOptions): DataBetweenQuotes => {
  let foundStartingQuote = false;
  let foundClosingQuote = false;
  const characters = [];
  let nextToken: Token | null = scanner.nextCharacterToken;
  for (; !foundClosingQuote && nextToken !== null; nextToken = scanner.nextCharacterToken) {
    const _isQuote = isQuote(nextToken.content, options);
    // ignore first quote
    if (!foundStartingQuote && _isQuote) {
      foundStartingQuote = true;
    } else if (foundStartingQuote) {
      if (isEscapeCharacter(nextToken.content, options)) {
        // advance past the escape character so we can get the next one in line
        scanner.advancePastToken(nextToken);
        const tokenFollowingEscape = scanner.nextCharacterToken;
        // if the character following the escape is a quote character then just add
        // the quote and advance to that character
        if (
          tokenFollowingEscape !== null &&
          (isQuote(tokenFollowingEscape.content, options) ||
            isEscapeCharacter(tokenFollowingEscape.content, options))
        ) {
          characters.push(tokenFollowingEscape.content);
          nextToken = tokenFollowingEscape;
        } else if (_isQuote) {
          // if the escape is also a quote then we found our closing quote and finish early
          foundClosingQuote = true;
        } else {
          // other wise add the escape token to the characters since it wast escaping anything
          characters.push(nextToken.content);
        }
      } else if (_isQuote) {
        // we found our closing quote!
        foundClosingQuote = true;
      } else {
        // add the token to the characters
        characters.push(nextToken.content);
      }
    }
    scanner.advancePastToken(nextToken);
  }
  return { col: characters.join(''), foundClosingQuote };
};

export default gatherDataBetweenQuotes;
