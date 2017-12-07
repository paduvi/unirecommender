const majors = require('../src/data/major');
const fs = require('fs-extra');

const output = majors.map(major => Object.assign({}, major, {chi_tieu: major.chi_tieu_truong}));

fs.writeJson('../src/data/major.json', output, {spaces: '\t'}).then(() => process.exit(0)).catch(err => {
    console.log(err);
    process.exit(1);
})