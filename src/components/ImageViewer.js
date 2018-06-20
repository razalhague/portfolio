import {muiThemeable} from 'material-ui/styles/index';
import PropTypes from 'prop-types';
import React from 'react';
import ImageBox from 'react-image-lightbox';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  changeImageIndex, closeGallery, getTitleRelativeToIndex, getUrlRelativeToIndex, imageGalleryShape, openGallery
} from '../ducks/imageGallery';
import FormattedMessages from './i18n/FormattedMessages';

const MAX_Z_INDEX = 2147483647;

/**
 * Generates the props nextSrc and prevSrc for ImageBox, if applicable.
 * @param imageGallery  The imageGallery state.
 * @return {{}}  An object with the applicable properties.
 */
const adjacentSrcProps = (imageGallery) => {
  let props = {};
  if (imageGallery.urls.length - imageGallery.index !== 1) {
    props.nextSrc = getUrlRelativeToIndex(imageGallery, +1)
  }
  if (imageGallery.index > 0) {
    props.prevSrc = getUrlRelativeToIndex(imageGallery, -1);
  }

  return props;
};

/**
 * Renders the image viewer if it is open.
 * @return {*}  The React component tree, or null of the viewer is not open.
 */
const ImageViewer = ({ imageGallery, actions: { openGallery, closeGallery, changeImageIndex }, muiTheme }) => {
  if (imageGallery.isOpen) {
    return (
      <FormattedMessages ids={
        ['close', 'next', 'prev', 'zoomIn', 'zoomOut', 'error'].map(subId => 'imageViewer.' + subId)
      }>
        {(close, next, prev, zoomIn, zoomOut, error) => (
          <ImageBox
            mainSrc={getUrlRelativeToIndex(imageGallery)}
            {...adjacentSrcProps(imageGallery)}
            onMoveNextRequest={() => changeImageIndex(+1)}
            onMovePrevRequest={() => changeImageIndex(-1)}
            onCloseRequest={() => closeGallery()}
            closeLabel={close}
            nextLabel={next}
            prevLabel={prev}
            zoomInLabel={zoomIn}
            zoomOutLabel={zoomOut}
            imageLoadErrorMessage={error}
            imageTitle={getTitleRelativeToIndex(imageGallery)}
            clickOutsideToClose={true}
            reactModalStyle={{
              overlay: {
                zIndex: MAX_Z_INDEX - 1,
                fontFamily: muiTheme.fontFamily,
              },
              content: {
                zIndex: MAX_Z_INDEX,
                fontFamily: muiTheme.fontFamily,
              },
            }}
          />
        )}
      </FormattedMessages>
    );
  } else {
    return null;
  }
};

ImageViewer.propTypes = {
  imageGallery: imageGalleryShape.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  imageGallery: state.imageGallery,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ openGallery, closeGallery, changeImageIndex }, dispatch),
});

export default muiThemeable()(connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageViewer))
