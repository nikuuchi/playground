///<reference path='./typings/jquery/jquery.d.ts' />

var Playground;
(function (Playground) {
    Playground.CodeGenTarget = "js";

    function CreateEditor(query) {
        var editor = ace.edit(query);
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/javascript");
        return editor;
    }
    Playground.CreateEditor = CreateEditor;

    function ChangeSyntaxHighlight(editor, targetMode) {
        editor.getSession().setMode("ace/mode/" + targetMode);
    }
    Playground.ChangeSyntaxHighlight = ChangeSyntaxHighlight;
})(Playground || (Playground = {}));

$(function () {
    var zenEditor = Playground.CreateEditor("zen-editor");
    var outputViewer = Playground.CreateEditor("output-viewer");
    outputViewer.setReadOnly(true);

    var Generate = function () {
        outputViewer.setValue(zenEditor.getValue());
        outputViewer.clearSelection();
    };

    var GenerateServer = function () {
        $.ajax({
            type: "POST",
            url: "cgi-bin/compile.cgi",
            data: JSON.stringify({ source: zenEditor.getValue(), option: Playground.CodeGenTarget }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                outputViewer.setValue(res.source);
            },
            error: function () {
                console.log("error");
            }
        });
    };

    var timer = null;
    zenEditor.on("change", function (cm, obj) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(Generate, 200);
    });

    var TargetNames = ["JavaScript", "Python", "Erlang", "C"];
    var TargetOptions = ["js", "python", "erlang", "c"];
    var TargetMode = ["javascript", "python", "erlang", "c_cpp"];

    var bind = function (n) {
        var Target = $('#Target-' + TargetNames[n]);
        Target.click(function () {
            Playground.CodeGenTarget = TargetOptions[n];
            $('li.active').removeClass("active");
            Target.parent().addClass("active");
            Playground.ChangeSyntaxHighlight(outputViewer, TargetMode[n]);
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            Generate();
        });
    };

    for (var i = 0; i < TargetNames.length; i++) {
        $("#Targets").append('<li id="Target-' + TargetNames[i] + '-li"><a href="#" id="Target-' + TargetNames[i] + '">' + TargetNames[i] + '</a></li>');
        bind(i);
    }

    $("#Target-JavaScript-li").addClass("active");
});
