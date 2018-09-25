import Pearl from '@ashurson/pearl';
const fs = window.require('fs-extra');
const parse = require('csv-parse');

export default class FilePearl extends Pearl {
    constructor() {
        super('FilePearl', function() {
            this.state = {
                legacyFile: {},
                legacyType: '',
                currentLegacyIndex: 0,
                totalLegacyIndex: 0,
                targetFile: {},
                targetType: '',
                currentTargetIndex: 0,
                totalTargetIndex: 0
            };
            this.readMappings = {
                'xlsx': () => {},
                'csv': (designation, index, limit) => {
                    limit = limit || null;
                    return new Promise((resolve, reject) => {
                        try {
                            const output = [];
                            const parser = parse();
                            const rs = fs.createReadStream('/tmp/mapt/' + designation + '/' + index);
                            parser.on('readable', function(){
                                let record;
                                while((record = parser.read())) {
                                    if (limit !== null && output.length > limit) {
                                        resolve(output);
                                    } else {
                                        output.push(record);
                                    }
                                }
                            });
                            rs.on('data', (chunk) => {
                                parser.write(chunk);
                            });
                            rs.on('end', () => {
                                resolve(output);
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                }
            };
            this.parseMappings = {
                'xlsx': () => {},
                'csv': (resolve, reject, designation) => {
                    try {
                        const maxSize = 10000000;
                        const numFiles = Math.ceil(this.state[designation + 'File'].size / maxSize);
                        let ws = new Array(numFiles);
                        for (let i=0; i < ws.length; i++) {
                            ws[i] = fs.createWriteStream('/tmp/mapt/' + designation + '/' + i);
                        }
                        let rs = fs.createReadStream(this.state[designation + 'File'].path);
                        let currentSize = 0;
                        let currentOffset = 0;
                        rs.on('data', (chunk) => {
                            currentSize += chunk.length;
                            const offset = Math.floor(currentSize / maxSize);

                            // find the last newline
                            if (currentOffset < offset) {
                                const chunkString = chunk.toString();
                                const lengthDiff = maxSize + chunkString.length - currentSize * (currentOffset + 1);
                                const firstHalf = chunkString.substring(0, lengthDiff);
                                const secondHalf = chunkString.substring(lengthDiff + 1);
                                const toNextNewRow = secondHalf.indexOf('\n');
                                const remainingRow = secondHalf.substring(0, toNextNewRow);
                                const remainingHalf = secondHalf.substring(toNextNewRow + 1);
                                ws[currentOffset].write(firstHalf);
                                ws[currentOffset].write(remainingRow);
                                currentOffset++;
                                ws[currentOffset].write(remainingHalf);
                            } else {
                                ws[currentOffset].write(chunk);
                            }
                        });
                        rs.on('end', () => {
                            ws.map(wso => {
                                return wso.close();
                            });
                            resolve();
                        })
                    } catch (err) {
                        reject(err);
                    }
                }
            };
            this.setFile = function(file, designation) {
                const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
                if (this.parseMappings.hasOwnProperty(fileType)) {
                    if (!(file.size < 20000000 || fileType === "csv" || fileType === "tsv")) {
                        alert('File too large. Please only use .csv and .tsv files when size is larger than 20mb');
                    } else {
                        const stateObj = {};
                        stateObj[designation + 'File'] = file;
                        stateObj[designation + 'Type'] = fileType;
                        this.setState(stateObj);
                        return this.parseFile(designation);
                    }
                } else {
                    alert('File not supported');
                }
            };
            this.parseFile = function(designation) {
                if (fs.existsSync('/tmp/mapt/' + designation)) {
                    fs.removeSync('/tmp/mapt/' + designation);
                }
                fs.mkdirSync('/tmp/mapt/' + designation);
                return new Promise((resolve, reject) => this.parseMappings[this.state[designation + 'Type']](resolve, reject, designation));
            };
            this.initCache = function() {
                if (!fs.existsSync('/tmp')) {
                    fs.mkdirSync('/tmp');
                }
                if (fs.existsSync('/tmp/mapt')) {
                    fs.removeSync('/tmp/mapt');
                }
                fs.mkdirSync('/tmp/mapt');
            };
            this.initCache();
        });
    }
}