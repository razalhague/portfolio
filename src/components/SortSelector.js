import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {projectSortOrderShape, setProjectSortOrder, SUPPORTED_PROJECT_SORT_ORDERS} from '../ducks/projectSortOrder';
import FormattedMessages from './i18n/FormattedMessages';

/**
 * Renders a button and its menu for selecting a sort order.
 * @return {*}  The React component tree.
 */
const SortSelector = ({ projectSortOrder, sortActions: { setProjectSortOrder } }) => (
  <FormattedMessages ids={['icon.sort', ...SUPPORTED_PROJECT_SORT_ORDERS.map(s => 'sort.' + s)]}>
    {(iconMsg, ...sortMsgs) => (
      <IconMenu
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        iconButtonElement={
          <IconButton
            iconClassName='fas fa-sort'
            tooltip={iconMsg}
          />
        }
      >
        {SUPPORTED_PROJECT_SORT_ORDERS.map((sort, idx) => (
          <MenuItem
            key={sort}
            onClick={() => setProjectSortOrder(sort)}
            primaryText={sortMsgs[idx]}
            disabled={projectSortOrder === sort}
          />
        ))}
      </IconMenu>
    )}
  </FormattedMessages>
);

SortSelector.propTypes = {
  projectSortOrder: projectSortOrderShape,
};

const mapStateToProps = (state) => ({
  projectSortOrder: state.projectSortOrder,
});

const mapDispatchToProps = (dispatch) => ({
  sortActions: bindActionCreators({ setProjectSortOrder }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SortSelector)
