import PropTypes from 'prop-types';

import ValueDuck from './ValueDuck';
import {ACTION_ROOT_NAMESPACE} from './namespace';
import {linkShape} from './projects';

const NS = ACTION_ROOT_NAMESPACE + 'header/';
const headerDuck = new ValueDuck(NS + 'setHeader', [], 'header');

export const headerShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(linkShape)
});

const header = headerDuck.createReducer();
export const setHeader = headerDuck.createActionCreator();

export default header;
