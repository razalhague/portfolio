import Chip from 'material-ui/Chip';
import {muiThemeable} from 'material-ui/styles/index';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {removeAllOverrides} from '../ducks/projectVisibilities';
import {toggleTag} from '../ducks/tagVisibilities';

const chipAppearance = (isSelected, theme) => {
  if (isSelected) {
    return {
      backgroundColor: theme.palette.accent2Color,
      labelColor: theme.palette.textColor,
    };
  } else {
    return {};
  }
};

/**
 * Renders a toggleable tag.
 * @param name  Name of the tag.
 * @param isSelected  Whether this tag is currently selected.
 * @return {*}  The React component tree.
 */
const Tag = ({ name, isVisible: isSelected, actions: { toggleTag, removeAllOverrides }, muiTheme }) => (
  <Chip
    {...chipAppearance(isSelected, muiTheme)}
    onClick={() => {
      toggleTag(name);
      removeAllOverrides();
    }}
    style={{
      margin: '0.1em',
      display: 'inline-block',
    }}
  >
    {name}
  </Chip>
);

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ toggleTag, removeAllOverrides }, dispatch),
});

export default muiThemeable()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Tag))
