type VectraStoreOptions = {
    debug: boolean;
    vectra: {
        path: string;
    };
};
declare function VectraStore(this: any, options: VectraStoreOptions): {
    name: string;
};
export default VectraStore;
