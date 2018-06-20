import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {removeAllOverrides} from '../ducks/projectVisibilities';
import {setAllTags, tagVisibilitiesShape} from '../ducks/tagVisibilities';

/**
 * Renders a button that clears selected tags.
 * @return {*}  React component tree for the button.
 */
const ClearTagsButton = ({ tagVisibilities, actions: { removeAllOverrides, setAllTags } }) => (
  <FormattedMessage id='icon.clearTags'>
    {(clearTagsMsg) => (
      <IconButton
        iconClassName='fas fa-times-circle'
        tooltip={clearTagsMsg}
        disabled={tagVisibilities.every(tv => !tv.isVisible)}
        onClick={() => {
          setAllTags(false);
          removeAllOverrides();
        }}
      />
    )}
  </FormattedMessage>
);

ClearTagsButton.propTypes = {
  tagVisibilities: tagVisibilitiesShape.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = (state) => ({
  tagVisibilities: state.tagVisibilities,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ removeAllOverrides, setAllTags }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClearTagsButton)
