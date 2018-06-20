import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Tag from './Tag';
import {removeAllOverrides} from '../ducks/projectVisibilities';
import {getTagVisibility, tagVisibilitiesShape, toggleTag} from '../ducks/tagVisibilities';

/**
 * Renders a list of tags.
 * @param {string[]} tags  An array of tags to be listed. If empty or missing, list all tags.
 * @return {*}  The React component tree.
 */
const TagList = ({ tags, tagVisibilities }) => (
  <span style={{ margin: '0.2em' }}>
    {
      (tags && tags.length > 0 ? tags : tagVisibilities.map(tv => tv.name))
        .map(t => <Tag key={t} name={t} isVisible={getTagVisibility(tagVisibilities, t).isVisible}/>)
    }
  </span>
);

TagList.propTypes = {
  tagVisibilities: tagVisibilitiesShape,
};

const mapStateToProps = (state) => ({
  tagVisibilities: state.tagVisibilities,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ toggleTag, removeAllOverrides }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagList)
