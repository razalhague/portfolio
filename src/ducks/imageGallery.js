import PropTypes from 'prop-types';

import {ACTION_ROOT_NAMESPACE} from './namespace';

const NS = ACTION_ROOT_NAMESPACE + 'imageGallery/';

const OPEN_GALLERY = NS + 'openGallery';
const CLOSE_GALLERY = NS + 'closeGallery';
const CHANGE_IMAGE_INDEX = NS + 'changeImage';

const URLS_PROP = 'urls';
const TITLES_PROP = 'titles';
const INDEX_PROP = 'index';
const INDEX_DELTA_PROP = 'indexDelta';

// action creators
export const openGallery = (urls, titles, index = 0) => ({
  type: OPEN_GALLERY,
  [URLS_PROP]: urls,
  [TITLES_PROP]: titles,
  [INDEX_PROP]: index,
});

export const closeGallery = () => ({ type: CLOSE_GALLERY });

export const changeImageIndex = (indexDelta) => ({
  type: CHANGE_IMAGE_INDEX,
  [INDEX_DELTA_PROP]: indexDelta,
});

// model
function ImageGallery(isOpen, urls = [], titles = [], index = 0) {
  this.isOpen = isOpen;
  this.urls = urls;
  this.titles = titles;
  this.index = index;
}

ImageGallery.closed = Object.freeze(new ImageGallery(false)); // use the same object for all closed gallery states

export const imageGalleryShape = PropTypes.shape({
  isOpen: PropTypes.bool.isRequired,
  urls: PropTypes.arrayOf(PropTypes.string),
  titles: PropTypes.arrayOf(PropTypes.string),
  index: PropTypes.number,
});

// reducer
const imageGallery = (state = ImageGallery.closed, action) => {
  switch (action.type) {
    case OPEN_GALLERY:
      return new ImageGallery(
        true,
        action[URLS_PROP],
        action[TITLES_PROP],
        action[INDEX_PROP]
      );
    case CHANGE_IMAGE_INDEX:
      return new ImageGallery(
        state.isOpen,
        state.urls,
        state.titles,
        (state.index + action[INDEX_DELTA_PROP]) % state.urls.length
      );
    case CLOSE_GALLERY:
      return ImageGallery.closed;
    default:
      return state;
  }
};

// selectors
export const getUrlRelativeToIndex = (imageGallery, indexDelta = 0) => {
  let index = imageGallery.index + indexDelta;
  return imageGallery.urls[index];
};

export const getTitleRelativeToIndex = (imageGallery, indexDelta = 0) => {
  let index = imageGallery.index + indexDelta;
  return imageGallery.titles[index];
};

export default imageGallery;
