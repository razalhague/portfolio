import React from 'react';
import {connect} from 'react-redux';

import Header from './Header';
import ImageViewer from './ImageViewer';
import ProjectList from './ProjectList';
import {languageShape} from '../ducks/language';

/**
 * Renders the app's UI.
 *
 * @return {*}  A tree of React components for the app's UI.
 */
const App = ({ language }) => (
  <div lang={language.code} className='App'>
    <Header />
    <ProjectList />
    <ImageViewer />
  </div>
);

App.propTypes = {
  language: languageShape,
};

const mapStateToProps = (state) => ({
  language: state.language,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
