[
    require("./lib/stringify"),
    require("./lib/traversal"),
    require("./lib/manipulation"),
    require("./lib/querying"),
    require("./lib/legacy"),
    require("./lib/helpers")
].forEach(function (ext) {
    Object.keys(ext).forEach(function (key) {
        module.exports[key] = ext[key];
    });
});
