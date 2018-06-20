import {black, greenA100, greenA200, greenA400, red700, red900, redA200, white} from 'material-ui/styles/colors';
import {getMuiTheme} from 'material-ui/styles/index';

const portfolioTheme = getMuiTheme({
  palette: {
    primary1Color: red700,
    primary2Color: red900,
    primary3Color: redA200,
    accent1Color: greenA200,
    accent2Color: greenA100,
    accent3Color: greenA400,
    textColor: black,
    alternateTextColor: white,
  }
});

export default portfolioTheme;
