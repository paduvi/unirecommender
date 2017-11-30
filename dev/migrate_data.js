const universities = require('./university');
const extra = require('./diemchuan');
const fs = require('fs-extra');

const output = universities.map(university => {
    const temp = extra.filter(u => u["maTruong"] == university.id)[0];
    if (!temp) {
        console.log(university.label);
    }

    return Object.assign({}, university, {chi_tieu: temp.diemChuan});
});

fs.writeJson('../src/data/university.json', output, {spaces: '\t'}).then(() => process.exit(0)).catch(err => {
    console.log(err);
    process.exit(1);
})