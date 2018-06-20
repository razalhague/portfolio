import PropTypes from 'prop-types';

import {ACTION_ROOT_NAMESPACE} from './namespace';

const NS = ACTION_ROOT_NAMESPACE + 'projectVisibilities/';

const SET_MANAGED_PROJECTS_ACTION = NS + 'setManagedProjects';
const OVERRIDE_VISIBILITY_ACTION = NS + 'override';
const REMOVE_VISIBILITY_OVERRIDE_ACTION = NS + 'removeOverride';
const REMOVE_ALL_VISIBILITY_OVERRIDES_ACTION = NS + 'removeAllOverrides';
const OVERRIDE_VISIBILITY_FOR_ALL_PROJECTS_ACTION = NS + 'overrideAll';

const PROJECT_NAME_PROP = 'name';
const PROJECT_VISIBILITY_PROP = 'visibility';
const PROJECTS_PROP = 'projects';

// action creators
export const setManagedProjects = (projects) => ({ type: SET_MANAGED_PROJECTS_ACTION, [PROJECTS_PROP]: projects });
export const overrideVisibility = (name, visibility) => ({
  type: OVERRIDE_VISIBILITY_ACTION,
  [PROJECT_VISIBILITY_PROP]: visibility,
  [PROJECT_NAME_PROP]: name,
});
export const removeOverride = (name) =>
  ({ type: REMOVE_VISIBILITY_OVERRIDE_ACTION, [PROJECT_NAME_PROP]: name });
export const removeAllOverrides = () => ({ type: REMOVE_ALL_VISIBILITY_OVERRIDES_ACTION });
export const overrideAll = (visibility) => ({
  type: OVERRIDE_VISIBILITY_FOR_ALL_PROJECTS_ACTION,
  [PROJECT_VISIBILITY_PROP]: visibility,
});

// model
export function ProjectVisibility(name, isOverridden = false, isVisible = false) {
  this.name = name;
  this.isOverridden = isOverridden;
  this.isVisible = isVisible;
  Object.freeze(this);
}

ProjectVisibility.prototype.overriddenTo = function (newVis) {
  if (this.isOverridden && this.isVisible === newVis) {
    return this;
  } else {
    return new ProjectVisibility(this.name, true, newVis);
  }
};

ProjectVisibility.prototype.removeOverride = function () {
  if (!this.isOverridden) {
    return this;
  } else {
    return new ProjectVisibility(this.name, false);
  }
};

export const projectVisibilitiesShape = PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  isOverridden: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool,
}));

// individual reducer
export const projectVisibility = (state, action) => { // there is no sensible initial state for an element
  switch (action.type) {
    case OVERRIDE_VISIBILITY_ACTION:
      if (action[PROJECT_NAME_PROP] === state.name) {
        return state.overriddenTo(action[PROJECT_VISIBILITY_PROP]);
      } else {
        return state;
      }
    case OVERRIDE_VISIBILITY_FOR_ALL_PROJECTS_ACTION:
      return state.overriddenTo(action[PROJECT_VISIBILITY_PROP]);
    case REMOVE_VISIBILITY_OVERRIDE_ACTION:
      if (action[PROJECT_NAME_PROP] === state.name) {
        return state.removeOverride();
      } else {
        return state;
      }
    case REMOVE_ALL_VISIBILITY_OVERRIDES_ACTION:
      return state.removeOverride();
    default:
      return state;
  }
};

// collection reducer
export const projectVisibilities = (state = [], action) => {
  switch (action.type) {
    case SET_MANAGED_PROJECTS_ACTION: // existing projects will retain their state, new ones will be set to default
      let commonProjects = state.filter(p => action[PROJECTS_PROP].includes(p.name));
      let commonProjectNames = commonProjects.map(p => p.name);
      let newProjectNames = action[PROJECTS_PROP].filter(name => !commonProjectNames.includes(name));
      let newProjects = newProjectNames.map(name => new ProjectVisibility(name));
      return [ ...commonProjects, ...newProjects ];
    case OVERRIDE_VISIBILITY_ACTION:
    case REMOVE_VISIBILITY_OVERRIDE_ACTION:
    case REMOVE_ALL_VISIBILITY_OVERRIDES_ACTION:
    case OVERRIDE_VISIBILITY_FOR_ALL_PROJECTS_ACTION:
      return state.map(el => projectVisibility(el, action));
    default:
      return state;
  }
};

// selectors
export const getProjectVisibility = (projectVisibilities, name) => {
  let pv = projectVisibilities.find(pv => pv.name === name);
  if (pv) {
    return pv;
  } else {
    throw new Error('could not find project of name ' + name);
  }
};

export default projectVisibilities;
