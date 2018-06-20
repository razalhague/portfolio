import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {projectIsExpanded} from './Project';
import {getProjectVisibility, overrideAll, projectVisibilitiesShape} from '../ducks/projectVisibilities';
import {getVisibleTags, tagVisibilitiesShape} from '../ducks/tagVisibilities';
import {projectsShape} from '../ducks/projects';
import FormattedMessages from './i18n/FormattedMessages';

/**
 * Renders buttons for expanding and collapsing all projects.
 * @return {*}  The React component tree for the buttons.
 */
const ExpandCollapseAllButtons = ({ projects, projVisibilities, tagVisibilities, actions: { overrideAll } }) => {
  let areProjectsExpanded = projects.map(p =>
    projectIsExpanded(p, getVisibleTags(tagVisibilities), getProjectVisibility(projVisibilities, p.name))
  );
  let allExpanded = areProjectsExpanded.every(isVisible => isVisible);
  let allCollapsed = areProjectsExpanded.every(isVisible => !isVisible);

  return (
    <FormattedMessages ids={['icon.expandAll', 'icon.collapseAll']}>
      {(expandMsg, collapseMsg) =>
        <span>
          <IconButton
            iconClassName='fas fa-chevron-down'
            tooltip={expandMsg}
            disabled={allExpanded}
            onClick={() => overrideAll(true)}
          />
          <IconButton
            iconClassName='fas fa-chevron-up'
            tooltip={collapseMsg}
            disabled={allCollapsed}
            onClick={() => overrideAll(false)}
          />
        </span>
      }
    </FormattedMessages>
  );
};

ExpandCollapseAllButtons.propTypes = {
  projects: projectsShape.isRequired,
  projVisibilities: projectVisibilitiesShape.isRequired,
  tagVisibilities: tagVisibilitiesShape.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = (state) => ({
  projects: state.projects,
  projVisibilities: state.projectVisibilities,
  tagVisibilities: state.tagVisibilities,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ overrideAll }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandCollapseAllButtons)
