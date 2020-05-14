const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const assert = chai.assert;
const deepClone = require("../src/index");

describe("deepClone", () => {
    it("它是一个函数", () => {
        assert.isFunction(deepClone);
    });
    it("能够复制基本类型", () => {
        const n = 123;
        const n2 = deepClone(n);
        assert(n === n2);
    });
});
