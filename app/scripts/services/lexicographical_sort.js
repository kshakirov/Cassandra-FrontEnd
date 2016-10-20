magento_module.service("LexicoGraphicalSort", function () {
    function chunkify_alphanumerics(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;
        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >=48 && i <= 57));
            if (m !== n) {
                tz[++y] = "";
                n = m;
            }
            tz[y] += j;
        }
        return tz;
    }

    function _sort(aa, bb) {
        for (x = 0; aa[x] && bb[x]; x++) {
            if (aa[x] !== bb[x]) {
                var c = Number(aa[x]), d = Number(bb[x]);
                if (c == aa[x] && d == bb[x]) {
                    return c - d;
                } else return (aa[x] > bb[x]) ? 1 : -1;
            }
        }
        return aa.length - bb.length;  
    }
    
    
    function compare_alphanumerics_by_key(a, b, key) {
        var aa = chunkify_alphanumerics(a[key].toLowerCase());
        var bb = chunkify_alphanumerics(b[key].toLowerCase());
        return _sort(aa,bb)
    }
    
    function compare_alphanumerics(a, b) {
        var aa = chunkify_alphanumerics(a.toLowerCase());
        var bb = chunkify_alphanumerics(b.toLowerCase());
        return _sort(aa,bb)
    }
    
    this.sortByKey = function (key) {
        return function (a, b) {
            var aa = chunkify_alphanumerics(a[key].toLowerCase());
            var bb = chunkify_alphanumerics(b[key].toLowerCase());
            return _sort(aa,bb)
        }
    };
    
    this.sort = function () {
        return compare_alphanumerics(a, b);
    };
    
})