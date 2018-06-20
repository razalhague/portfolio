import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {linkShape} from '../ducks/projects';

const iconClassName = {
  github: 'fab fa-github',
  gitlab: 'fab fa-gitlab',
  googlePlay: 'fab fa-google-play',
  home: 'fas fa-home',
  link: 'fas fa-link',
  email: 'fas fa-envelope-open',
};

/**
 * Renders a link, either with an icon button or a text button.
 * @param link  An object describing the link.
 * @return {*}  The React component tree.
 */
const Link = ({ link: { url, text, icon }, style }) => {
  if (text && icon) {
    return (
      <FormattedMessage id={text}>
        {linkMsg =>
          <FlatButton
            label={linkMsg}
            href={url}
            labelStyle={style}
            icon={<FontIcon className={iconClassName[icon]} />}
          />
        }
      </FormattedMessage>
    );
  } else if (text) {
    return (
      <FormattedMessage id={text}>
        {linkMsg => <FlatButton label={linkMsg} href={url} labelStyle={style} />}
      </FormattedMessage>
    );
  } else if (icon) {
    return (
      <FormattedMessage id={'icon.' + icon}>
        {(iconMsg) =>
          <IconButton
            iconClassName={iconClassName[icon]}
            href={url}
            tooltip={iconMsg}
            iconStyle={style}
          />
        }
      </FormattedMessage>
    );
  } else {
    throw new Error('unrecognized link type');
  }
};

Link.propTypes = {
  link: linkShape,
};

export default Link
