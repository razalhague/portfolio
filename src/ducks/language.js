import PropTypes from 'prop-types';

import ValueDuck from './ValueDuck';
import {ACTION_ROOT_NAMESPACE} from './namespace';

const NS = ACTION_ROOT_NAMESPACE + 'language/';
export const SUPPORTED_LANGUAGES = ['fi', 'en'];
export const DEFAULT_LANGUAGE = 'en';

const languageDuck = new ValueDuck(
  NS + 'setLanguage',
  { code: DEFAULT_LANGUAGE, messages: {}},
  'language',
  language => SUPPORTED_LANGUAGES.includes(language.code)
);

export const languageShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  messages: PropTypes.objectOf(PropTypes.string),
});

const language = languageDuck.createReducer();
export const setLanguage = languageDuck.createActionCreator();

/**
 * Finds the best match from the user's desired languages, and languages supported by the app. If no match is found,
 * returns the app's default language.
 * @param {string[]} desiredLanguages  An array of language codes, in order of preference.
 * @returns {string}  The language code of the best match.
 */
export function getBestLanguageMatch(desiredLanguages) {
  let [ firstMatchingLanguage ] = desiredLanguages.filter(l => SUPPORTED_LANGUAGES.includes(l));
  if (firstMatchingLanguage) {
    return firstMatchingLanguage;
  } else {
    return DEFAULT_LANGUAGE;
  }
}

export default language;
