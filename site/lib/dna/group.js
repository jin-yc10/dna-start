/**
 * Created by jin-yc10 on 15/8/24.
 */

var groupCnt = 0;

function Group(id){
    this.id = id;
    this.cnt = groupCnt;
    groupCnt ++;
    this.strands = {};
}

Group.prototype.addStrand = function(strand) {
    this.strands[strand.id] = strand;
};
