import PropTypes from 'prop-types';
import {injectIntl,intlShape} from 'react-intl';

/**
 * A function to render the messages into a component.
 *
 * @callback renderFunction
 * @param {...string} messages  The translated message.
 * @return {*}  The rendered component.
 */

/**
 * Translates several messages in one go.
 * @param {string[]} ids  A list of message IDs that are to be translated.
 * @param {renderFunction} children  A function that takes as parameters the translated messages, in the same order as
 *   the provided id list.
 * @returns {*}  The return value of the given render function.
 */
const FormattedMessages = ({ids, children, intl}) => { // intl is injected by injectIntl below
  let messages = ids.map(id => intl.formatMessage({id: id}));
  return children(...messages);
};

FormattedMessages.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(FormattedMessages)
