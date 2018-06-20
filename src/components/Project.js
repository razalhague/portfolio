import Avatar from 'material-ui/Avatar';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Contribution from './Contribution';
import GalleryButton from './GalleryButton';
import Learned from './Learned';
import Link from './Link';
import {projectShape} from '../ducks/projects';
import {getProjectVisibility, overrideVisibility, projectVisibilitiesShape} from '../ducks/projectVisibilities';
import {getVisibleTags, tagVisibilitiesShape} from '../ducks/tagVisibilities';
import FormattedMessages from './i18n/FormattedMessages';

/**
 * Calculates whether the given project is expanded or not.
 * @param project  The project whose expandedness is to be determined.
 * @param visibleTags  A list of tags that are currently selected.
 * @param projectOverride  The override information for this project.
 * @return {*}  Is the project expanded.
 */
export const projectIsExpanded = (project, visibleTags, projectOverride) => {
  if (projectOverride.isOverridden) {
    return projectOverride.isVisible;
  } else {
    return project.tags.some(tag => visibleTags.includes(tag));
  }
};

const projectIcon = (icon, name) => {
  if (icon) {
    return <Avatar src={'images/' + icon} />
  } else {
    return <Avatar>{name.charAt(0)}</Avatar>;
  }
};

export const projectInfo = (label, content) => (
  <div>
    <span style={{ fontWeight: 'bold' }}>{label}</span> <span>{content}</span>
  </div>
);

// NOTE: With a fairly small max height and hidden overflow, content must remain short or risk becoming invisible.
// max height is small because 'height:auto' cannot be animated, and setting max height large makes the animations ugly.
// overflow is hidden to avoid scrollbars during expansion.
const EXPANDED_STYLE = {
  maxHeight: '20em',
  transition: 'max-height 0.4s ease-in',
  overflow: 'hidden',
};

const COLLAPSED_STYLE = {
  maxHeight: '0',
  transition: 'max-height 0.3s ease-out',
  overflow: 'hidden',
};

/**
 * Renders a project's information.
 * @param project  The project to render.
 * @return {*}  The React component tree.
 */
const Project = ({ project, tagVisibilities, projectVisibilities, actions: { overrideVisibility } }) => {
  let expanded = projectIsExpanded(
    project,
    getVisibleTags(tagVisibilities),
    getProjectVisibility(projectVisibilities, project.name)
  );
  return (
    <FormattedMessages ids={['name', 'tagLine'].map(subId => 'projects.' + project.name + '.' + subId)}>
      {(name, tagLine) => (
        <div style={{padding: '0.3em'}}>
          <Card
            onExpandChange={newStatusIsVisible => overrideVisibility(project.name, newStatusIsVisible)}
            expanded={expanded}
          >
            <CardHeader
              title={name}
              subtitle={tagLine}
              showExpandableButton={true}
              actAsExpander={true}
              avatar={projectIcon(project.icon, name)}
            />
            <div style={expanded ? EXPANDED_STYLE : COLLAPSED_STYLE}>
              <CardText>
                <div style={{ marginLeft: '4em', marginRight: '2em' }}>
                  <p><FormattedMessage id={'projects.' + project.name + '.description'}/></p>
                  {projectInfo(
                    <FormattedMessage id='project.type.label'/>,
                    <FormattedMessage id={'project.type.' + project.type}/>
                  )}
                  {projectInfo(
                    <FormattedMessage id='project.years.label'/>,
                    project.years.join(', ')
                  )}
                  {projectInfo(
                    <FormattedMessage id='project.tags.label'/>,
                    project.tags.join(', ')
                  )}
                  <Contribution project={project}/>
                  <Learned project={project}/>
                </div>
              </CardText>
              <CardActions>
                <div style={{ marginLeft: '4em', marginRight: '2em' }}>
                  <GalleryButton project={project}/>
                  {project.links.map(link => <Link key={link.url} link={link}/>)}
                </div>
              </CardActions>
            </div>
          </Card>
        </div>
      )}
    </FormattedMessages>
  );
};

Project.propTypes = {
  project: projectShape.isRequired,
  tagVisibilities: tagVisibilitiesShape.isRequired,
  projectVisibilities: projectVisibilitiesShape.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = (state) => ({
  tagVisibilities: state.tagVisibilities,
  projectVisibilities: state.projectVisibilities,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ overrideVisibility }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Project)
