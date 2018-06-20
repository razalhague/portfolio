import PropTypes from 'prop-types';

import {ACTION_ROOT_NAMESPACE} from './namespace';

const DEFAULT_IS_VISIBLE = false;

const NS = ACTION_ROOT_NAMESPACE + 'tagVisibilities/';

export const TOGGLE_TAG_ACTION = NS + 'toggleTag';
export const SET_ALL_TAGS_ACTION = NS + 'setAllTags';
export const SET_VISIBLE_TAGS_ACTION = NS + 'setVisibleTags';
export const SET_MANAGED_TAGS_ACTION = NS + 'setManagedTags';

export const TAGS_PROP = 'tags';
export const TAG_NAME_PROP = 'name';
export const TAG_VISIBILITY_PROP = 'visibility';

// action creators
export const setManagedTags = (tags) => ({ type: SET_MANAGED_TAGS_ACTION, [TAGS_PROP]: tags });
export const setVisibleTags = (visibleTags) => ({ type: SET_VISIBLE_TAGS_ACTION, [TAGS_PROP]: visibleTags });
export const toggleTag = (name) => ({ type: TOGGLE_TAG_ACTION, [TAG_NAME_PROP]: name });
export const setAllTags = (visibility) => ({ type: SET_ALL_TAGS_ACTION, [TAG_VISIBILITY_PROP]: visibility });

// model
/**
 * Represents the isVisible of a tag.
 * @param name
 * @param isVisible
 * @constructor
 */
export function TagVisibility(name, isVisible = DEFAULT_IS_VISIBLE) {
  this.name = name;
  this.isVisible = isVisible;
  Object.freeze(this);
}

export const tagVisibilitiesShape = PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
}));

/**
 * Creates a copy of this object with the visibility changed to the given value.
 * @param {boolean} newVis
 * @returns {TagVisibility}
 */
TagVisibility.prototype.withVisibility = function (newVis) {
  if (newVis === this.isVisible) {
    return this;
  } else {
    return new TagVisibility(this.name, newVis);
  }
};

// individual reducer
const tagVisibility = (state, action) => { // there is no sensible initial state for an individual element
  switch (action.type) {
    case TOGGLE_TAG_ACTION:
      if (state.name === action[TAG_NAME_PROP]) {
        return state.withVisibility(!state.isVisible);
      } else {
        return state;
      }
    case SET_ALL_TAGS_ACTION:
      return state.withVisibility(action[TAG_VISIBILITY_PROP]);
    case SET_VISIBLE_TAGS_ACTION:
      return state.withVisibility(action[TAGS_PROP].includes(state.name));
    default:
      return state;
  }
};

// collection reducer
const tagVisibilities = (state = [], action) => {
  switch (action.type) {
    case SET_MANAGED_TAGS_ACTION: // sets what tags are managed by the filter. existing tags retain their state.
      let commonTags = state.filter(tag => action[TAGS_PROP].includes(tag.name));
      let commonTagNames = commonTags.map(tag => tag.name);
      let newTagNames = action[TAGS_PROP].filter(name => !commonTagNames.includes(name));
      let newTags = newTagNames.map(name => new TagVisibility(name));
      return [ ...commonTags, ...newTags ];
    case SET_VISIBLE_TAGS_ACTION: // sets what tags are visible.
    case TOGGLE_TAG_ACTION: // toggles the tag.
    case SET_ALL_TAGS_ACTION: // sets all tags to the given value.
      return state.map(tag => tagVisibility(tag, action));
    default:
      return state;
  }
};

// selectors
export const getVisibleTags = tvs => tvs.filter(tv => tv.isVisible).map(tv => tv.name);
export const getTagVisibility = (tagVisibilities, name) => {
  let tv = tagVisibilities.find(tv => tv.name === name);
  if (tv) {
    return tv;
  } else {
    throw new Error('could not find project of name ' + name);
  }
};

export default tagVisibilities;
