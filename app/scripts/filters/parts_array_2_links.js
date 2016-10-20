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



magento_module.filter('parts_array_2_urls', function ($filter) {

    function compare_alphanumerics(a, b) {
        var aa = chunkify_alphanumerics(a.part_number.toLowerCase());
        var bb = chunkify_alphanumerics(b.part_number.toLowerCase());
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


    function _create_url_array(parts) {
        var links = parts.sort(compare_alphanumerics);
        links  = links.map(function (current, index, parts) {
            return '<a href="#/part/sku/' + current.sku + ' ">' + current.part_number + '</a>'
        })
        return links.join(", ");
    }

    return function (parts) {
        if (parts.length > 0) {
            return _create_url_array(parts);
        } else {
            return "";
        }
    };
});


magento_module.filter('strings_array_2_sorted_array', function ($filter) {
    function compare_alphanumerics(a, b) {
        var aa = chunkify_alphanumerics(a);
        var bb = chunkify_alphanumerics(b);
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

    function _sort_array(parts) {
        var links = parts.sort(compare_alphanumerics);
        return links.join(", ");
    }

    return function (parts) {
        if (parts.length > 0) {
            return _sort_array(parts);
        } else {
            return "";
        }
    };
});


