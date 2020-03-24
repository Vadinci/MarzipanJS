//TODO logging
const COMMON_EXTERNAL = [
    '#Marzipan'
];

const path = require('path');
const fs = require('fs');

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
    let runStart = Date.now();
    console.log('[BUILDING]');
    for (let ii = 0; ii < toBuild.length; ii++) {
        let taskStart = Date.now();
        console.log("building " + toBuild[ii] + "...");
        await build(toBuild[ii]);
        console.log("\t...done! (" + (Date.now() - taskStart) + "ms)");
    };
    console.log("[COMPLETED] " + (Date.now() - runStart) + "ms");
};

if (toBuild[0] === 'all') {
    toBuild = [];
    fs.readdir('./modules', (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        toBuild = files;
        run();
    })
} else {
    run();
}

