import React from 'react';
import {FormattedMessage} from 'react-intl';

import {projectShape} from '../ducks/projects';
import {projectInfo} from "./Project";

const LEARNED_ELEMENT = 'learned';

/**
 * Renders a description of things learned from the project.
 * @param project  The project the lesson was learned from
 * @return {*}  The React component tree.
 */
const Learned = ({ project }) => {
  if (project.elements && project.elements.includes(LEARNED_ELEMENT)) {
    return (
      <div>
        {projectInfo(
          <FormattedMessage id='project.learned.label'/>,
          <FormattedMessage id={'projects.' + project.name + '.learned'}/>
        )}
      </div>
    );
  } else {
    return null;
  }
};

Learned.propTypes = {
  project: projectShape.isRequired,
};

export default Learned
