const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const env = process.env.NODE_ENV;
const logDir = './app/logger/logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => new Date().toLocaleTimeString();
const logger = createLogger({
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        printf(({level, message, timestamp}) => `${timestamp} - ${level}: ${message}`),
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

module.exports = !(env === 'test') ? logger : {info: () => {}, error: () => {}};
