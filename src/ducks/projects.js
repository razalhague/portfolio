import PropTypes from 'prop-types';

import ValueDuck from './ValueDuck';
import {ACTION_ROOT_NAMESPACE} from './namespace';

const NS = ACTION_ROOT_NAMESPACE + 'projects/';
const projectsDuck = new ValueDuck(NS + 'setProjects', [], 'projects');

export const linkShape = PropTypes.shape({
  url: PropTypes.string.isRequired,
  icon: PropTypes.string,
  text: PropTypes.string,
});

export const projectShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
  contribution: PropTypes.shape({
    text: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
  }),
  elements: PropTypes.arrayOf(PropTypes.string),
  icon: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
  })),
  links: PropTypes.arrayOf(linkShape),
});

export const projectsShape = PropTypes.arrayOf(projectShape);

const projects = projectsDuck.createReducer();
export const setProjects = projectsDuck.createActionCreator();

export default projects;
