import PropTypes from 'prop-types';

import ValueDuck from './ValueDuck';
import {ACTION_ROOT_NAMESPACE} from './namespace';

const NS = ACTION_ROOT_NAMESPACE + 'projectSortOrder/';

export const CHRONO_SORT = 'chrono';
export const ABC_SORT = 'abc';
export const REL_SORT = 'rel';
export const DEFAULT_PROJECT_SORT_ORDER = CHRONO_SORT;
/**
 * Possible sort orders for the projects.
 *
 * Chronological sort ('chrono') sorts according to the contents of the project's years array. Primarily by the largest
 * year in the array, secondarily by the average of the years array, all in descending order.
 *
 * Relevance sort ('rel') sorts according to how well the project's tags array matches the currently chosen tags.
 * Primarily by the how many of the project's tags match the chosen ones (descending), secondarily by how many of the
 * project's tags don't match the chosen ones (ascending).
 *
 * Alphabetical sort ('abc') sorts according to the project's name, in ascending order.
 * @type {string[]}
 */
export const SUPPORTED_PROJECT_SORT_ORDERS = [ CHRONO_SORT, REL_SORT, ABC_SORT ];

const projectSortOrderDuck = new ValueDuck(
  NS + 'setProjectSortOrder',
  DEFAULT_PROJECT_SORT_ORDER,
  'sortOrder',
  sortOrder => SUPPORTED_PROJECT_SORT_ORDERS.includes(sortOrder)
);

export const projectSortOrderShape = PropTypes.string;

const projectSortOrder = projectSortOrderDuck.createReducer();
export const setProjectSortOrder = projectSortOrderDuck.createActionCreator();

export function getBestProjectSortOrderMatch(desiredProjectSortOrder) {
  if (SUPPORTED_PROJECT_SORT_ORDERS.includes(desiredProjectSortOrder)) {
    return desiredProjectSortOrder;
  } else {
    return DEFAULT_PROJECT_SORT_ORDER;
  }
}

export default projectSortOrder;
