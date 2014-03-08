define(["struct", "dataBuilding"], function(struct, dataBuilder) {
  "use strict";

  // FIXME: technically this is only the format1 charset object

  var Charset = function(stringIndex, input) {
    var glyphs = [];
    if(!this.parse(input)) {
      input = input || {};
      input.format = 1;
      input.letters = input.letters || [];
      this.fill(input);
      input.letters.forEach(function(letter) {
        var sid = stringIndex.getStringId(letter);
        var SID = dataBuilder.encoder.USHORT(sid);
        glyphs = glyphs.concat(SID);
      });
      this.glyphs = glyphs;
    }
  };

  Charset.prototype = new struct([
      ["format", "BYTE", ""]
    , ["glyphs", "LITERAL", "actually a USHORT[]."]
  ]);

  return Charset;
});
