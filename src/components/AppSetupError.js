import PropTypes from 'prop-types';
import React from 'react';

/**
 * Renders an error screen in case setting up the app failed.
 * @param {string} reason  The message to be displayed.
 * @return {*}
 */
const AppSetupError = ({ reason }) => (
  <div id='appSetupError'>
    Failed to set up application: {reason}
  </div>
);

AppSetupError.propTypes = {
  reason: PropTypes.any.isRequired,
};

export default AppSetupError
