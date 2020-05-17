const fs = require('fs');
const util = require('util');
const {createLogger, format, transports} = require('winston');

const env = process.env.NODE_ENV;
const logDir = './app/logger/logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

function transform(info, opts) {
    const args = info[Symbol.for('splat')];
    if (args) { info.message = util.format(info.message, ...args); }
    return info;
  }
  
function utilFormatter() { return {transform}; }

const tsFormat = () => new Date().toLocaleTimeString();
const logger = createLogger({
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        utilFormatter(),     // <-- this is what changed
        format.printf(({level, message, label, timestamp}) => `${timestamp} - ${level}: ${message}`),
    ),
    transports: [
    new transports.Console({
        timestamp: tsFormat,
        colorize: false,
        formatter: function(params) {
            return undefined !== params.message ? params.message : "";
        },
        prettyPrint: true,
    }),

    new (require('winston-daily-rotate-file'))({
        filename: `${logDir}/app.log`,
        timestamp: tsFormat,
        datePattern: 'dd-MM-yyyy',
        prepend: true,
        json: false,
        prettyPrint: true,
        level: env === 'development' ? 'verbose' : 'info',
    }),
    ],
    exitOnError: false,
});

module.exports.stream = {
  write: function (message) {
    logger.info(message);
    console.log('message = ', message);
  },
};
module.exports = !(env === 'test') ? logger : {info: () => {}, error: () => {}};
