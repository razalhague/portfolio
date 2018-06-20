import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl';

// this component is necessary to change language without re-starting the application
export default connect(
  state => ({
    locale: state.language.code,
    messages: state.language.messages,
    key: state.language.code,
  })
)(IntlProvider);