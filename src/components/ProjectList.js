import React from 'react';
import {connect} from 'react-redux';

import ClearTagsButton from './ClearTagsButton';
import ExpandCollapseAllButtons from './ExpandCollapseAllButtons';
import Project from './Project';
import SortSelector from './SortSelector';
import TagList from './TagList';
import {ABC_SORT, CHRONO_SORT, REL_SORT, projectSortOrderShape} from '../ducks/projectSortOrder';
import {getVisibleTags, tagVisibilitiesShape} from '../ducks/tagVisibilities';
import {projectsShape} from "../ducks/projects";
import {languageShape} from "../ducks/language";

/**
 * Creates a sort function for a chronological sort.
 * @return {function(*, *): number}  The sort function.
 */
const getChronologicalSort = () => (a, b) =>
  -(Math.min(...a.years) - Math.min(...b.years)); // TODO: secondary sort criterion

/**
 * Creates a sort function for an alphabetical sort.
 * @param {string} languageCode  The code of the language to be used when sorting.
 * @param {Object} nameMsgs  An object that maps project names to their translation.
 * @return {function(*, *): number}  The sort function.
 */
const getAlphabeticalSort = (languageCode, nameMsgs) => (a, b) =>
  (nameMsgs[a.name].toLowerCase().localeCompare(nameMsgs[b.name].toLowerCase(), languageCode));

/**
 * Calculates an absolute comparison value for a project to be used in tag relevance sorting.
 * @param project  The project to calculate the value for.
 * @param highlightedTags  Currently selected tags.
 * @return {*}  A number of the form N.M, where N = number of tags the project has that match the selected tags, and
 * M = 1 / (number of tags the project has that do not match the selected tags + 2). M is calculated with an inverse so
 * that the value of M will fit between 0 and 1, and the +2 is so that the value will always be < 1.
 */
const relevanceComparisonValue = (project, highlightedTags) => {
  let matches = project.tags.filter(t => highlightedTags.includes(t)).length;
  let mismatches = project.tags.length - matches;
  return matches + (1 / (mismatches + 2));
};

/**
 * Creates a sort function for a relevance sort.
 * @param highlightedTags  The currently selected tags.
 * @return {function(*=, *=): number}  The sort function.
 */
const getRelevanceSort = (highlightedTags) => (a, b) =>
  -(relevanceComparisonValue(a, highlightedTags) - relevanceComparisonValue(b, highlightedTags));

const getProjectSortFunction = (sort, highlightedTags, languageCode, nameMsgs) => {
  switch (sort) {
    case CHRONO_SORT: // reverse chronological, based on project start year
      return getChronologicalSort();
    case ABC_SORT:
      return getAlphabeticalSort(languageCode, nameMsgs);
    case REL_SORT: // sorted based how well the project's tags match the ones chosen for display
      return getRelevanceSort(highlightedTags);
    default:
      throw new Error('unrecognized sort order');
  }
};

// TODO: use react-intl?
const getProjectNameMsgMap = (projectNames, messages) =>
  Object.assign({}, ...projectNames.map(name => ({[name]: messages['projects.' + name + '.name']})));

/**
 * Renders a list of projects.
 * @return {*}  The React component tree.
 */
const ProjectList = ({ projects, projectSortOrder, tagVisibilities, language }) => (
  <div style={{maxWidth: '70em', margin: '0 auto'}}>
    <div className='clearfix'>
      <ClearTagsButton />
      <TagList />
      <div style={{ float: 'right', }}>
        <ExpandCollapseAllButtons />
        <SortSelector />
      </div>
    </div>
    <div>
      {projects
        .slice() // duplicate array so as not to mutate state with the sort
        .sort(getProjectSortFunction(
          projectSortOrder,
          getVisibleTags(tagVisibilities),
          language.code,
          getProjectNameMsgMap(projects.map(p => p.name), language.messages)
        ))
        .map(p => <Project key={p.name} project={p}/>)
      }
    </div>
  </div>
);

ProjectList.propTypes = {
  projects: projectsShape.isRequired,
  projectSortOrder: projectSortOrderShape.isRequired,
  tagVisibilities: tagVisibilitiesShape.isRequired,
  language: languageShape.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.language,
  projects: state.projects,
  projectSortOrder: state.projectSortOrder,
  tagVisibilities: state.tagVisibilities,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectList)
