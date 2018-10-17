import Pearl from '@ashurson/pearl';
import FilePearl from '../file';

class MappingPearl extends Pearl {
  constructor() {
    super('MappingPearl', function() {
      this.state = {
        legacyFields: [],
        targetFields: [],
        mappings: [],
        completed: 0,
        invalidRows: [],
        invalidCount: 0,
        validCount: 0
      };
      this.setFields = (designation, fields) => {
        const updated = {};
        updated[designation + 'Fields'] = fields;
        this.setState(updated);
      };
      this.getMappings = () => {
        return this.state.mappings;
      };
      this.setMappings = (mappings) => {
        this.setState({mappings: mappings, completed: 0});
      };
      this.getIncludedMappings = () => {
        return this.state.mappings.filter(mapping => mapping.included);
      };
      this.FilePearl = new FilePearl();
      this.matchLegacy = (legacyCache, target, includedMappings) => {
        let isFound = false;
        for (let i=0; i<legacyCache.length; i++) {
          let fieldsMatch = true;
          for (let j=0; j<includedMappings.length; j++) {
            if (includedMappings[j].source.sourceObj.type === 'Reference') {
              if (target[includedMappings[j].fieldIndex] !== legacyCache[i][includedMappings[j].source.sourceObj.value.fieldIndex]) {
                fieldsMatch = false;
                break;
              }
            } else {
              // leave for later
            }
          }
          if (!isFound) {
            isFound = fieldsMatch;
          } else {
            break;
          }
        }
        return isFound;
      };
      this.runCache = async (cacheObj) => {
        let invalidCount = 0;
        let validCount = 0;
        let invalidRows = [];
        const targetCache = cacheObj.cache;
        const includedMappings = cacheObj.includedMappings;
        const refreshCache = cacheObj.refreshCache;
        const legacyLength = cacheObj.legacyLength;

        let legacyIndex = 0;
        let legacyCache = await refreshCache('legacy', legacyIndex);

        for (let i = 0; i < targetCache.length; i++) {
          console.log('i: ' + i);
          let runCount = legacyLength;
          let isFound = this.matchLegacy(legacyCache, targetCache[i], includedMappings);
          while (!isFound && runCount > 0) {
            if (legacyIndex < legacyLength - 1) {
              legacyIndex ++;
            } else {
              legacyIndex = 0;
            }
            legacyCache = await refreshCache('legacy', legacyIndex);
            runCount--;
            isFound = this.matchLegacy(legacyCache, targetCache[i], includedMappings);
          }
          if (isFound) {
            validCount++;
          } else {
            invalidCount++;
            invalidRows.push(targetCache[i]);
          }
        }
        return {
          invalidRows: invalidRows,
          validCount: validCount,
          invalidCount: invalidCount,
          legacyCache: legacyCache,
          legacyIndex: legacyIndex
        };
      };
      this.run = async (updater) => {
        let invalidCount = 0;
        let validCount = 0;
        let invalidRows = [];
        let targetCache = [];

        const targetLength = Math.ceil(this.FilePearl.state.targetFile.size / 2000000);
        const legacyLength = Math.ceil(this.FilePearl.state.legacyFile.size / 2000000);
        const includedMappings = this.getIncludedMappings();
        const refreshCache = this.FilePearl.readMappings[this.FilePearl.state.legacyType];

        for (let i=0; i < targetLength; i++) {
          updater(i * 100 / targetLength);
          targetCache = await this.FilePearl.readMappings[this.FilePearl.state.targetType]('target', i);
          const results = await this.runCache({
            cache: targetCache,
            includedMappings: includedMappings,
            refreshCache: refreshCache,
            legacyLength: legacyLength
          });
          invalidCount += results.invalidCount;
          validCount += results.validCount;
        }
        return {
          invalidRows: invalidRows,
          validCount: validCount,
          invalidCount: invalidCount
        };
      };
    });
  }
}

export default MappingPearl;