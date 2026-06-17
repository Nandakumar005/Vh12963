import axios from 'axios';

const LOG_API_URL = 'http://4.224.186.213/evaluation-service/log';
const PACKAGE_NAME = 'notification-system';

const LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

let stackCounter = 0;

function getStackId() {
  return `stack-${Date.now()}-${++stackCounter}`;
}

async function log(stack, level, pkg, message) {
  try {
    await axios.post(LOG_API_URL, {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch {
    // Silently fail — logging should never break the app
  }
}

const logger = {
  info(message) {
    return log(getStackId(), LEVELS.INFO, PACKAGE_NAME, message);
  },

  warn(message) {
    return log(getStackId(), LEVELS.WARN, PACKAGE_NAME, message);
  },

  error(message) {
    return log(getStackId(), LEVELS.ERROR, PACKAGE_NAME, message);
  },

  debug(message) {
    return log(getStackId(), LEVELS.DEBUG, PACKAGE_NAME, message);
  },

  logWithStack(stack, level, pkg, message) {
    return log(stack, level, pkg, message);
  },
};

export default logger;
