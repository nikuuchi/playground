///<reference path='./typings/jquery/jquery.d.ts' />

var Playground;
(function (Playground) {
    function CreateEditor(query) {
        var editor = ace.edit(query);
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/javascript");
        return editor;
    }
    Playground.CreateEditor = CreateEditor;
})(Playground || (Playground = {}));

$(function () {
    var zenEditor = Playground.CreateEditor("zen-editor");
    var outputViewer = Playground.CreateEditor("output-viewer");
    outputViewer.setReadOnly(true);

    var Generate = function () {
        outputViewer.getSession().setMode("ace/mode/css");
        outputViewer.setValue(zenEditor.getValue());
    };

    var timer = null;
    zenEditor.on("change", function (cm, obj) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(Generate, 200);
    });
});
