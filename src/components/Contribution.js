import React from 'react';
import {FormattedMessage} from 'react-intl';
import {muiThemeable} from 'material-ui/styles/index';
import PropTypes from 'prop-types';

import {projectShape} from '../ducks/projects';
import {projectInfo} from "./Project";

const CONTRIBUTION_DESCRIPTION_ELEMENT = 'contributionDescription';

const contributionBar = (percent, text, muiTheme) => (
  <span style={{
    width: '9em',
    border: '1px solid ' + muiTheme.palette.accent1Color,
    display: 'inline-block',
    borderRadius: '0.4em',
  }}>
      <span style={{
        width: percent + '%',
        backgroundColor: muiTheme.palette.accent1Color,
        display: 'inline-block',
        textAlign: 'center',
        borderRadius: '0.3em', // smaller radius so that no gap is visible
      }}>
        {text}
      </span>
    </span>
);

const Contribution = ({ project, muiTheme }) => (
  <div className='contribution'>
    {projectInfo(
      <FormattedMessage id='project.contribution.label'/>,
      <span>
        {contributionBar(project.contribution.percent, project.contribution.text, muiTheme)}
        {project.elements && project.elements.includes(CONTRIBUTION_DESCRIPTION_ELEMENT) &&
          <span> <FormattedMessage id={'projects.' + project.name + '.contribution'}/></span>
        }
      </span>
    )}
  </div>
);

Contribution.propTypes = {
  project: projectShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(Contribution)

