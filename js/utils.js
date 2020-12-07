function download(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var downloadData = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(downloadData);
    save_link.download = name;
    fake_click(save_link);
}
function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
    );
    obj.dispatchEvent(ev);
}
function stox(wb) {
    var out = [];
    wb.SheetNames.forEach(function (name) {
        var o = { name: name, rows: {} };
        var ws = wb.Sheets[name];
        var aoa = XLSX.utils.sheet_to_json(ws, { raw: false, header: 1 });
        aoa.forEach(function (r, i) {
            var cells = {};
            r.forEach(function (c, j) { cells[j] = ({ text: c }); });
            o.rows[i] = { cells: cells };
        })
        out.push(o);
    });
    return out;
}
function xtos(sdata) {
    var out = XLSX.utils.book_new();
    sdata.forEach(function (xws) {
        var aoa = [[]];
        var rowobj = xws.rows;
        for (var ri = 0; ri < rowobj.len; ++ri) {
            var row = rowobj[ri];
            if (!row) continue;
            aoa[ri] = [];
            Object.keys(row.cells).forEach(function (k) {
                var idx = +k;
                if (isNaN(idx)) return;
                aoa[ri][idx] = row.cells[k].text;
            });
        }
        var ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(out, ws, xws.name);
    });
    return out;
}
