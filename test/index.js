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

        const s = "123";
        const s2 = deepClone(s);
        assert(s === s2);

        const b = true;
        const b2 = deepClone(b);
        assert(b === b2);

        const u = undefined;
        const u2 = deepClone(u);
        assert(u === u2);

        const empty = null;
        const empty2 = deepClone(empty);
        assert(empty === empty2);

        const sym = Symbol();
        const sym2 = deepClone(sym);
        assert(sym === sym2);
    });

    describe("对象", () => {
        it("能够复制普通对象", () => {
            const a = { name: "john", age: 18, child: { name: "bao" } };
            const a2 = deepClone(a);
            assert(a !== a2);
            assert(a.name === a2.name);
            assert(a.child !== a2.child);
            assert(a.child.name === a2.child.name);
        });
        it("能够复制数组对象", () => {
            const a = [
                [11, 12],
                [21, 22],
                [31, 32],
            ];
            const a2 = deepClone(a);
            assert(a !== a2);
            assert(a[0] !== a2[0]);
            assert(a[1] !== a2[1]);
            assert(a[2] !== a2[0]);
            assert.deepEqual(a, a2);
        });
        it("能够复制函数", () => {
            const a = function (x, y) {
                return x + y;
            };
            a.xxx = { yyy: { zzz: 1 } };
            const a2 = deepClone(a);
            assert(a !== a2);
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
            assert(a.xxx.yyy !== a2.xxx.yyy);
            assert(a.xxx !== a2.xxx);
            assert(a(1, 2) === a2(1, 2));
        });
        it("能够复制引用（环）", () => {
            const a = { name: "john", age: 18 };
            a.self = a;
            const a2 = deepClone(a);
            assert(a !== a2);
            assert(a.name === a2.name);
            assert(a.self !== a2.self);
        });
        xit("防止爆栈", () => {
            const a = { child: null };
            let b = a;
            for (let i = 0; i < 20000; i++) {
                b.child = {
                    child: null,
                };
                b = b.child;
            }
            const a2 = deepClone(a);
            assert(a !== a2);
            assert(a.child !== a2.child);
        });
        it("能够复制正则表达式", () => {
            const a = /hi\d+/gi;
            a.xxx = { yyy: { zzz: 1 } };
            const a2 = deepClone(a);
            assert(a.source === a2.source);
            assert(a.flags === a2.flags);
            assert(a !== a2);
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
            assert(a.xxx.yyy !== a2.xxx.yyy);
            assert(a.xxx !== a2.xxx);
        });
        it("能够复制 Date", () => {
            const a = new Date();
            a.xxx = { yyy: { zzz: 1 } };
            const a2 = deepClone(a);
            assert(a !== a2);
            assert(a.getTime() === a2.getTime());
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
            assert(a.xxx.yyy !== a2.xxx.yyy);
            assert(a.xxx !== a2.xxx);
        });
        it("自动跳过原型属性", () => {
            const a = Object.create({ name: "John" });
            a.xxx = { yyy: { zzz: 1 } };
            const a2 = deepClone(a);
            assert(a !== a2);
            assert.isFalse("name" in a2);
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
            assert(a.xxx.yyy !== a2.xxx.yyy);
            assert(a.xxx !== a2.xxx);
        });
    });
});
