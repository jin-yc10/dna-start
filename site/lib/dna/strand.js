/**
 * Created by jin-yc10 on 15/8/21.
 */
/*

 */

var strandIds = [];

function Strand(id, length) {
    if( strandIds.indexOf(id) > -1 || id.length == 0 ) {
        this.id = "Strand"+strandIds.length.toString();
        strandIds.push(this.id);
    } else {
        this.id = id;
    }
    this.length = length;

    this.link3 = null;
    this.link5 = null;

    this.matches = [

    ];
}

Strand.prototype.link3 = function(strand) {
    if( this.link3 !== null) {
        this.link3 = strand.id;
    }
};

Strand.prototype.link5 = function(strand) {
    if( this.link5 !== null) {
        this.link5 = strand.id;
    }
};

Strand.prototype.addMatch = function(strand, startIdx, endIdx) {
    // Validate arguments
    // Check Overlap
    this.matches.push([
        strand, startIdx, endIdx
    ]);
};