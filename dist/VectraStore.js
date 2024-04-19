"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vectra_1 = require("vectra");
function VectraStore(options) {
    const seneca = this;
    let index;
    const store = {
        name: 'VectraStore',
        save: async function (msg, reply) {
            const ent = msg.ent;
            const vector = await getVector(ent.data$()); // Conversion function needed
            const metadata = { ...ent.data$(), id: ent.id };
            try {
                await index.insertItem({ vector, metadata });
                reply(null, ent);
            }
            catch (err) {
                reply(err);
            }
        },
        load: async function (msg, reply) {
            const q = msg.q || {};
            try {
                const result = await index.getItem(q.id);
                if (result) {
                    const ent = seneca.make$(result.metadata);
                    reply(null, ent);
                }
                else {
                    reply(null);
                }
            }
            catch (err) {
                reply(err);
            }
        },
        list: async function (msg, reply) {
            const query = buildQuery(msg);
            try {
                // Assuming default topK value of 10 if not provided
                const topK = msg.size$ || 10;
                const results = await index.queryItems(query.vector, topK);
                const entities = results.map((item) => seneca.make$(item.metadata));
                reply(null, entities);
            }
            catch (err) {
                reply(err);
            }
        },
        remove: async function (msg, reply) {
            const q = msg.q || {};
            try {
                if (q.id) {
                    await index.deleteItem(q.id);
                    reply(null);
                }
                else {
                    throw new Error('ID is required for remove operation');
                }
            }
            catch (err) {
                reply(err);
            }
        }
    };
    this.add({ init: store.name }, function (msg, respond) {
        index = new vectra_1.LocalIndex(options.vectra.path);
        index.createIndex().then(() => respond()).catch(respond);
    });
    return { name: store.name };
}
function buildQuery(msg) {
    const q = msg.q || {};
    if (q.id) {
        return { vector: [ /* id-based vector values here, if applicable */], size: msg.size$ || 10 };
    }
    else if (q.vector) {
        return { vector: q.vector }; // Ensure this is an array of numbers
    }
    return { vector: [] }; // Default empty vector if no conditions met
}
async function getVector(data) {
    // Convert data to a vector
    return [ /* vector values */];
}
exports.default = VectraStore;
if (typeof module !== 'undefined') {
    module.exports = VectraStore;
}
//# sourceMappingURL=VectraStore.js.map