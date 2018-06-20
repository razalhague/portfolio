import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {languageShape, setLanguage, SUPPORTED_LANGUAGES} from '../ducks/language';
import {getLocalization} from '../';
import FormattedMessages from './i18n/FormattedMessages';

/**
 * Renders a language select button and its menu, provided that there is more than one supported language.
 * @return {*}  The React component tree, or null if only one supported language.
 */
const LanguageSelector = ({ language, iconStyle, actions: { setLanguage } }) => {
  if (SUPPORTED_LANGUAGES.length > 1) {
    return (
      <FormattedMessages ids={['icon.language', ...SUPPORTED_LANGUAGES.map(l => 'language.' + l)]}>
        {(languageButtonMsg, ...languageMsgs) => (
          <IconMenu
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            iconButtonElement={
              <IconButton
                iconClassName='fas fa-language'
                iconStyle={iconStyle}
                tooltip={languageButtonMsg}
              />
            }
          >
            {SUPPORTED_LANGUAGES.map((languageCode, idx) => (
              <MenuItem
                key={languageCode}
                primaryText={languageMsgs[idx]}
                disabled={languageCode === language.code}
                onClick={() =>
                  getLocalization(languageCode)
                    .then(messages => setLanguage({code: languageCode, messages: messages}))
                }
              />
            ))}
          </IconMenu>
        )}
      </FormattedMessages>
    );
  } else {
    return null;
  }
};

LanguageSelector.propTypes = {
  language: languageShape.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = (state) => ({
  language: state.language,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ setLanguage }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelector)
