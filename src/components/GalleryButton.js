import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {openGallery} from '../ducks/imageGallery';
import {projectShape} from '../ducks/projects';

const buttonLabel = (project, intl) => {
  if (project.images.length > 1)
    return intl.formatMessage({id: 'icon.gallery'}) + ' (' + project.images.length + ')';
  else
    return intl.formatMessage({id: 'icon.image'});
};

/**
 * Renders a button to open the project's image gallery, if it has one.
 * @return {*}  The React component tree, or null if the project has no images.
 */
const GalleryButton = ({ project, intl, actions: { openGallery } }) => {
  if (project.images && project.images.length > 0) {
    let imageFiles = project.images.map(img => 'images/' + img.file);
    let imageTitles = project.images.map(img =>
      intl.formatMessage({id: 'projects.' + project.name + '.images.' + img.title})
    );
    return (
      <FlatButton
        label={buttonLabel(project, intl)}
        icon={<FontIcon className='fas fa-images' />}
        onClick={() => openGallery(imageFiles, imageTitles)}
      />
    );
  } else {
    return null;
  }
};

GalleryButton.propTypes = {
  project: projectShape.isRequired,
  intl: intlShape.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ openGallery }, dispatch),
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryButton))
