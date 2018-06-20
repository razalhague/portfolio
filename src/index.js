import {MuiThemeProvider} from 'material-ui';
import React from 'react';
import ReactDOM from 'react-dom';
import {addLocaleData} from 'react-intl';
import localeDataEn from 'react-intl/locale-data/en';
import localeDataFi from 'react-intl/locale-data/fi';
import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import YAML from 'yamljs';

import registerServiceWorker from './registerServiceWorker';

import {getSetupFromEnvironment} from "./environment";
import portfolioTheme from "./theme";
import App from './components/App';
import AppSetupError from './components/AppSetupError';
import ConnectedIntlProvider from "./components/i18n/ConnectedIntlProvider";
import header from "./ducks/header";
import imageGallery from "./ducks/imageGallery";
import language, {getBestLanguageMatch} from "./ducks/language";
import projects from "./ducks/projects";
import projectSortOrder, {getBestProjectSortOrderMatch} from "./ducks/projectSortOrder";
import projectVisibilities, {ProjectVisibility} from "./ducks/projectVisibilities";
import tagVisibilities, {TagVisibility} from "./ducks/tagVisibilities";


function getLocaleData(language) {
  switch (language) {
    case 'fi':
      return localeDataFi;
    case 'en':
      return localeDataEn;
    default:
      throw new Error('no locale data for ' + language);
  }
}

function fetchLocalization(language) {
  return fetch('messages/' + language + '.yaml')
}

function getResponseText(response) {
  if (response.ok) {
    return response.text();
  } else {
    throw new Error('Failed to fetch '+ response.url + ': ' + response.statusText);
  }
}

export function getLocalization(langCode) {
  addLocaleData(getLocaleData(langCode));
  return fetchLocalization(langCode)
    .then(getResponseText)
    .then(YAML.parse);
}

const genInitialState = ([ language, setup, messages, portfolioData ]) => {
  let tagLists = portfolioData.projects.map(project => project.tags);
  let tagsCombined = [].concat(...tagLists); // flatten
  let tagsUnduped = tagsCombined.filter((val, idx, arr) => arr.indexOf(val) === idx);
  let tagsSorted = tagsUnduped.slice().sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase(), language.code));

  return {
    language: { code: language, messages: messages },
    projects: portfolioData.projects,
    header: portfolioData.header,
    tagVisibilities: tagsSorted.map(t => new TagVisibility(t, setup.tagsToDisplay.includes(t))),
    projectVisibilities: portfolioData.projects.map(p => new ProjectVisibility(p.name)),
    projectSortOrder: getBestProjectSortOrderMatch(setup.desiredProjectSortOrder),
    imageGallery: undefined,
  };
};

const reducers = {
  language,
  projects,
  header,
  tagVisibilities,
  projectVisibilities,
  projectSortOrder,
  imageGallery,
};

/**
 * Returns a function that creates a redux store from the given preloaded state.
 * @param isDebugMode
 * @return {function(*=): Store<any>}
 */
const genStore = isDebugMode => {
  if (isDebugMode)
    return preLoadedState => createStore(combineReducers(reducers), preLoadedState, devToolsEnhancer());
  else
    return preLoadedState => createStore(combineReducers(reducers), preLoadedState);
};

function renderApp(store) {
  // locale data is required even though we only use the library for message formatting
  let state = store.getState();
  addLocaleData(getLocaleData(state.language.code));
  ReactDOM.render(
    <MuiThemeProvider muiTheme={portfolioTheme}>
      <Provider store={store}>
        <ConnectedIntlProvider>
          <App />
        </ConnectedIntlProvider>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
}

function renderError(reason) {
  ReactDOM.render(
    <AppSetupError reason={reason}/>,
    document.getElementById('root')
  );
}


const setup = getSetupFromEnvironment(window);
if (setup.isDebugMode) {
  console.log(setup);
}
const appLanguage = Promise.resolve(setup.desiredLanguages)
  .then(getBestLanguageMatch);
const localization = appLanguage
  .then(fetchLocalization)
  .then(getResponseText)
  .then(YAML.parse);
const portfolio = fetch('portfolio.yaml')
  .then(getResponseText)
  .then(YAML.parse);

Promise.all([ appLanguage, Promise.resolve(setup), localization, portfolio])
  .then(genInitialState)
  .then(genStore(setup.isDebugMode))
  .then(renderApp)
  .catch(renderError);

registerServiceWorker();
