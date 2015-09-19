/**
 * Created by jin-yc10 on 15/9/17.
 */

DN3.Strand = Backbone.Model.extend({
    /**
     * Bio Part
     */
    sequence: {},
    length: 0,
    // 5' => 3'
    end3: {}, // 3' end, can link to 1 strand end5
    end5: {}, // the opposite of 3', this link will generate a virtual link
    matches: [], //
    /**
     * ThreeJS Part
     */
    startPosition: {},
    direction: {},
    /* endPosition = startPosition + direction * length */
    endPosition: (function() {
        return {};
    })()
});

DN3.StrandMatch = Backbone.Model.extend({
    Strand1: {},
    Strand1_start_idx: -1,
    Strand2: {},
    Strand2_start_idx: -1
});