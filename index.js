'use strict';

module.exports = function (content, file, options) {

    var this_id = file.getId().replace(file.ext, '');

    return content.toString()
        .replace(/["']![^'"\s]+["']/g, function (str) {
            return str.replace('.js', '').replace('!this', this_id);
        })
        .replace(/<script.*?data-name=["'](.*?)["'].*?>([\s\S]*?)<\/script>/g, function (str, name, value) {
            if (name.match(/\.js$/))
                return value;
            name = file.realpathNoExt + name.replace('this', '');
            var f = fis.file.wrap(name);
            f.cache = file.cache;
            f.setContent(value);
            fis.compile.process(f);
            f.links.forEach(function (derived) {
                file.addLink(derived);
            });
            file.derived.push(f);
            file.addRequire(f.getId());
            return '';
        })
        .replace(/<script.*?>([\s\S]*?)<\/script>/g, function (str, value) {
            return value;
        });
};