// 处理引用（环）
// [[source1,dist1],[source2,dist2],[source3,dist3]...]
let cache = [];

function deepClone(source) {
    if (source instanceof Object) {
        let cacheDist = findCode(source);
        if (cacheDist) {
            return cacheDist;
        } else {
            let dist;
            if (source instanceof Array) {
                dist = new Array();
            } else if (source instanceof Function) {
                dist = function () {
                    return source.apply(this, arguments);
                };
            } else {
                dist = new Object();
            }

            // dist 赋值后先放入 cache 中，防止后续的递归中找不到
            cache.push([source, dist]);

            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    dist[key] = deepClone(source[key]);
                }
            }
            return dist;
        }
    }
    return source;
}

function findCode(source) {
    for (let i = 0; i < cache.length; i++) {
        if (cache[i][0] === source) {
            return cache[i][1];
        }
    }
    return undefined;
}

module.exports = deepClone;
