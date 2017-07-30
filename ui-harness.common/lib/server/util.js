"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob_1 = require("glob");
function rsyncExecute(rsync) {
    return new Promise(function (resolve, reject) {
        rsync.execute(function (err, code, cmd) {
            if (err) {
                reject(err);
            }
            else {
                resolve({ err: err, code: code, cmd: cmd });
            }
        });
    });
}
exports.rsyncExecute = rsyncExecute;
function glob(pattern, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        new glob_1.Glob(pattern, options, function (err, matches) {
            if (err) {
                reject(err);
            }
            else {
                resolve(matches);
            }
        });
    });
}
exports.glob = glob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQVM1QixzQkFBNkIsS0FBVTtJQUNyQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQWUsVUFBQyxPQUFPLEVBQUUsTUFBTTtRQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBVSxFQUFFLElBQVksRUFBRSxHQUFXO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE9BQU8sQ0FBQyxFQUFFLEdBQUcsS0FBQSxFQUFFLElBQUksTUFBQSxFQUFFLEdBQUcsS0FBQSxFQUFFLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFWRCxvQ0FVQztBQWdCRCxjQUFxQixPQUFlLEVBQUUsT0FBMEI7SUFBMUIsd0JBQUEsRUFBQSxZQUEwQjtJQUM5RCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVcsVUFBQyxPQUFPLEVBQUUsTUFBTTtRQUMzQyxJQUFJLFdBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQUMsR0FBRyxFQUFFLE9BQU87WUFDdEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25CLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVZELG9CQVVDIn0=