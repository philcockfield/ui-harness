"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = {
    silent: false,
    info: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        write(items);
    },
    warn: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        write(items);
    },
    error: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        write(items);
    },
    DEBUG: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        write(items);
    },
};
exports.default = exports.log;
var write = function (items) {
    if (global.console && !exports.log.silent) {
        console.log.apply(console, items);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudC9sb2cvbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR2EsUUFBQSxHQUFHLEdBQUc7SUFDakIsTUFBTSxFQUFFLEtBQUs7SUFDYixJQUFJO1FBQUMsZUFBZTthQUFmLFVBQWUsRUFBZixxQkFBZSxFQUFmLElBQWU7WUFBZiwwQkFBZTs7UUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFBQyxDQUFDO0lBQ3ZDLElBQUk7UUFBQyxlQUFlO2FBQWYsVUFBZSxFQUFmLHFCQUFlLEVBQWYsSUFBZTtZQUFmLDBCQUFlOztRQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDdkMsS0FBSztRQUFDLGVBQWU7YUFBZixVQUFlLEVBQWYscUJBQWUsRUFBZixJQUFlO1lBQWYsMEJBQWU7O1FBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUN4QyxLQUFLO1FBQUMsZUFBZTthQUFmLFVBQWUsRUFBZixxQkFBZSxFQUFmLElBQWU7WUFBZiwwQkFBZTs7UUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFBQyxDQUFDO0NBQ3pDLENBQUM7QUFDRixrQkFBZSxXQUFHLENBQUM7QUFJbkIsSUFBTSxLQUFLLEdBQUcsVUFBQyxLQUFZO0lBQ3pCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztBQUNILENBQUMsQ0FBQyJ9