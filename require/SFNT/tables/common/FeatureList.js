define(["struct", "makeStructy", "FeatureRecord", "FeatureTable"], function(struct, makeStructy, FeatureRecord, FeatureTable) {
  "use strict";

  var FeatureList = function(input) {
    this.pairs = [];
    if(!this.parse(input)) {
      input = input || {};
      this.fill(input);
    }
  };

  FeatureList.prototype = new struct([
      ["FeatureCount",    "USHORT", "Number of features in this feature list"]
    , ["FeatureRecords",  "LITERAL", "Array of FeatureRecords; zero-based (first feature has FeatureIndex = 0), listed alphabetically by FeatureTag"]
    , ["FeatureTables",   "LITERAL", "the list of feature tables"]
  ]);

  FeatureList.prototype.addFeature = function(options) {
    var featureRecord = new FeatureRecord({
      FeatureTag: options.FeatureTag
    });
    delete options.FeatureTag;
    var featureTable = new FeatureTable(options);
    this.pairs.push({
      record: featureRecord,
      table: featureTable,
      finalize: function(idx) {
        this.record.Offset = idx;
        this.table.finalize(idx);
      }
    });
    return featureTable;
  };

  FeatureList.prototype.finalize = function() {
    this.FeatureCount = this.pairs.length;
    this.pairs.sort(function(a,b) {
      return a.record.FeatureTag < b.record.FeatureTag ? -1 : 1;
    });
    var records = [],
        tables = [];
    this.pairs.forEach(function(p, idx) {
      p.finalize(idx);
      records.push(p.record);
      tables.push(p.table);
    });
    this.FeatureRecords = makeStructy(records);
    this.FeatureTables = makeStructy(tables);
  };

  return FeatureList
});
