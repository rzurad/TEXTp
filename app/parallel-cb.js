/* global Parallel */

function ParallelCb() {
    Parallel.apply(this, arguments);
}

ParallelCb.prototype.spawn = function () {
    console.log('hi, i am the modified Parallel.js spawn function!');
    return Parallel.prototype.spawn.apply(this, arguments);
};

Object.setPrototypeOf(ParallelCb.prototype, Parallel.prototype);

export default ParallelCb;
