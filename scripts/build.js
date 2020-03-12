//TODO logging
const COMMON_EXTERNAL = [
    '#Marzipan'
];

const path = require('path');

const rollup = require('rollup');

//todo better argument processing
let toBuild = process.argv.slice(2);

let build = async function (mod) {
    //__dirname gets the path of the script, rather than the path of where we're running node from
    //process.cwd() seems to do the trick
    let properties = require(path.resolve(process.cwd(), 'modules/' + mod + '/module.json'));

    let input = {};
    input.input = 'modules/' + mod + '/main.js';
    input.external = COMMON_EXTERNAL.concat(properties.external || []);

    let output = {};
    output.file = 'dist/' + mod + '.mod.js';
    output.format = 'esm';

    //TODO improve versioning
    output.intro = '/* bundle version ' + properties.version + ' */';

    let bundle = await rollup.rollup(input);
    await bundle.generate(output);
    await bundle.write(output);
};

//TODO await?
let run = async function () {
    for (let ii = 0; ii < toBuild.length; ii++) {
        await build(toBuild[ii]);
    };
};

run();
