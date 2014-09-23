/* globals Parallel */

export default function isCompatibleEnv() {
    try {
        new Parallel([1]).spawn(function (data) { return data[0]; });
    } catch (e) {
        return false;
    }

    return typeof File !== 'undefined' && typeof FileList !== 'undefined' && typeof FileReader !== 'undefined';
}
