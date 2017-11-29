const cheerio = require('cheerio');
const rp = require('request-promise-native');
const fs = require('fs-extra');


const crawl_data = async (url = 'http://diemthi.tuyensinh247.com/tu-van-chon-truong.html') => {
    const response = await rp(url);
    return response;
}

const parse_branch_data = (html) => {
    const $ = cheerio.load(html);

    return $("select#select_branch option").filter((i, el) => $(el).attr('value') != 0).map((i, el) => {
        // this === el
        el = $(el);
        return {
            id: el.attr('value'),
            label: el.text()
        }
    }).get();
}

const parse_block_data = (html) => {
    const $ = cheerio.load(html);

    return $("select#block option").filter((i, el) => !!$(el).attr('value')).map((i, el) => {
        // this === el
        el = $(el);
        return {
            id: el.attr('value'),
            label: el.text()
        }
    }).get();
}

const get_list_university_major_in_branch = async (branch, university) => {
    const url = 'http://diemthi.tuyensinh247.com/tu-van-chon-truong/tinh0-loaidaotao0-bacdaotao0-tongdiem0-khoiall-nhomnganh' + branch + '-truong' + university + '.html';

    const html = await crawl_data(url);
    const $ = cheerio.load(html);

    return $(".resul-seah tr").filter((i, el) => {
        return i > 1 && $(el).children('th').length == 0;
    }).map((i, el) => {
        el = $(el);
        const major = {
            'ma_nganh': el.find('td:nth-child(2)').text(),
            'ten_nganh': el.find('td:nth-child(3)').text(),
            'diem_chuan': el.find('td:nth-child(5)').text(),
            'ghi_chu': el.find('td:nth-child(6)').text()
        }
        console.log(major);
        return major;
    }).get();
}

(async () => {
    try {
        const html = await crawl_data();
        const branch_data = parse_branch_data(html);
        await fs.writeJson('../src/data/branch.json', branch_data, {spaces: '\t'});
        const block_data = parse_block_data(html);
        await fs.writeJson('../src/data/block.json', block_data, {spaces: '\t'});
        const list_university = require('./university');

        let major_data = {}
        const fn = async (branch, university) => {
            const majors = await get_list_university_major_in_branch(branch, university);
            if (!majors.length)
                return Promise.resolve();
            if (!major_data[university]) {
                major_data[university] = {}
            }
            Object.assign(major_data[university], {
                [branch]: majors
            });
            return Promise.resolve();
        }
        await branch_data.reduce((p1, branch) => p1
            .then(() => list_university.reduce((p2, university) => p2
                .then(() => fn(branch.id, university.id)), Promise.resolve())), Promise.resolve());
        console.log('write to file');
        await fs.writeJson('../src/data/major.json', major_data, {spaces: '\t'});
        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();