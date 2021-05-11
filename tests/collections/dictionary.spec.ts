import {Dictionary} from "../../src/collections/dictionary";
import {expect} from "chai";
import sinon from 'sinon';

describe('Dictionary', () => {
    describe('With primitives', () => {
        it('set/get', () => {
            const dictionary = new Dictionary<string, number>();

            dictionary.set('key', 777);

            const value = dictionary.get('key');

            const expected = 777;

            expect(value).equal(expected);
        })

        it('set/update', () => {
            const dictionary = new Dictionary<string, number>();

            dictionary.set('key', 777);
            dictionary.set('key', 888);

            const value = dictionary.get('key');

            const expected = 888;

            expect(value).equal(expected);
        })

        it('set/remove', () => {
            const dictionary = new Dictionary<string, number>();

            dictionary.set('key', 777);
            dictionary.remove('key');

            const value = dictionary.get('key');

            const expected = undefined;

            expect(value).equal(expected);
        })
    })

    it('Insert with rehash', () => {
        const dictionary = new Dictionary<string, number>();

        // @ts-ignore;
        const origin = dictionary.rehash;

        // @ts-ignore
        const spy = sinon.stub(dictionary, 'rehash').callsFake(function () { origin.apply(this, arguments) });

        for(let i = 0; i < 1200; i++) {
            dictionary.set(i.toString(), i);
        }

        expect(spy.callCount).equal(2);
    })
})
