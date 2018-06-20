import AppBar from 'material-ui/AppBar';
import {muiThemeable} from 'material-ui/styles/index';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import LanguageSelector from './LanguageSelector';
import Link from './Link';
import {headerShape} from '../ducks/header';

/**
 * Renders the page's header.
 * @return {*}  The React component tree.
 */
const Header = ({ header: { title, links }, muiTheme }) => (
  <FormattedMessage id={title}>
    {titleMsg => (
      <div style={{ height: '4.5em' }}> {/* must define height because AppBar's position is set to fixed */}
        <AppBar
          style={{ position: 'fixed' }}
          showMenuIconButton={false}
          title={titleMsg}
          iconElementRight={
            <span>
              {links.map(link =>
                <Link
                  key={link.url}
                  link={link}
                  style={{ color: muiTheme.palette.alternateTextColor }}
                />
              )}
              <LanguageSelector iconStyle={{ color: muiTheme.palette.alternateTextColor }} />
            </span>
          }
        />
      </div>
    )}
  </FormattedMessage>
);

Header.propTypes = {
  header: headerShape,
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  header: state.header,
});

const mapDispatchToProps = (dispatch) => ({
});

export default muiThemeable()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header))
