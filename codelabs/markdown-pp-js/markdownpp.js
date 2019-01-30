var markdownpp = require('./index.js');

var argv = require('yargs')
    .usage('Usage: markdownpp {infile} [-o outfile] [-l] [-e excluded,modules]')
    .help('h')
    .alias('h','help')
    .string('outfile')
    .alias('o','outfile')
    .describe('outfile','the output file')
    .string('exclude')
    .alias('e','exclude')
    .describe('exclude','the list of modules to exclude')
    .boolean('list')
    .alias('l','list')
    .describe('list','list modules')
    .alias('h','help')
    .strict()
    .version(function() {
        return require('../package.json').version;
    })
    .argv;

if (argv.exclude) {
    var exclusions = argv.exclude.split(',');
    for (var ex of exclusions) {
        if (typeof markdownpp.modules[ex] === 'boolean') {
            markdownpp.modules[ex] = false;
        }
    }
}

if (argv.list) {
    for (var m in markdownpp.modules) {
        console.log(m+' '+markdownpp.modules[m]);
    }
}

if (argv._.length>0) {
    markdownpp.render(argv._[0],argv.outfile);
}