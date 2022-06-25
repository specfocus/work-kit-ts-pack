import MESSAGES from './messages';
import ZStream from './zstream';

const err = (strm: ZStream<any>, errorCode: keyof typeof MESSAGES): keyof typeof MESSAGES => {
  strm.msg = MESSAGES[errorCode];
  return errorCode;
};

export default err;
