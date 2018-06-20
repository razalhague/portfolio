const LANGUAGE_URL_PARAM = 'lang';
const SORT_URL_PARAM = 'sort';
const TAGS_URL_PARAM = 'tags';
const DEBUG_URL_PARAM = 'debug';

const getUrlParameter = (urlString, parameter) =>
  new URL(urlString).searchParams.get(parameter);

/**
 * Extracts the language code from a locale string.
 * @param localeString  A locale string.
 * @return {string}  The language code.
 */
const stripExtras = localeString => {
  let underscoreIndex = localeString.indexOf('_');
  if (underscoreIndex > 0) {
    return localeString.substring(0, underscoreIndex);
  } else {
    return localeString;
  }
};

const getDesiredLanguages = (window) => [
  stripExtras(getUrlParameter(window.location.href, LANGUAGE_URL_PARAM) || ""),
  ...window.navigator.languages.map(stripExtras),
  stripExtras(window.navigator.userLanguage || window.navigator.language),
].filter(lang => lang !== '');

const getDesiredProjectSortOrder = (window) => getUrlParameter(window.location.href, SORT_URL_PARAM);

const getTags = (window) => {
  let tagString = getUrlParameter(window.location.href, TAGS_URL_PARAM);
  if (tagString) {
    return tagString.split(',');
  } else {
    return [];
  }
};

const getDebugMode = (window) => {
  let debugString = getUrlParameter(window.location.href, DEBUG_URL_PARAM);
  switch (debugString) {
    case 'true':
    case 't':
    case '1':
      return true;
    default:
      return false;
  }
};

/**
 * Extracts the relevant information about the appropriate defaults from the browser's windows object.
 * @param window  The window object.
 * @return {{tagsToDisplay: string[], desiredLanguages: string[], desiredProjectSortOrder: string, isDebugMode: boolean}}  The relevant information.
 */
export const getSetupFromEnvironment = (window) => ({
  isDebugMode: getDebugMode(window),
  tagsToDisplay: getTags(window),
  desiredLanguages: getDesiredLanguages(window),
  desiredProjectSortOrder: getDesiredProjectSortOrder(window),
});
