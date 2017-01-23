"use strict";
var Table = (function () {
    function Table(trump) {
        this.gameArea = [null, null, null, null];
        this.trump = trump;
    }
    Table.prototype.addCard = function (index, item) {
        this.gameArea.splice(index, 0, item);
    };
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=table.js.map