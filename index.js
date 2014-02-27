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
    Playground.ChangeSyntaxHighlight(zenEditor, "typescript");
    var outputViewer = Playground.CreateEditor("output-viewer");
    outputViewer.setReadOnly(true);

    //var Generate = () => {
    //    outputViewer.setValue(zenEditor.getValue());
    //    outputViewer.clearSelection();
    //};
    var GenerateServer = function () {
        $.ajax({
            type: "POST",
            url: "cgi-bin/compile.cgi",
            data: JSON.stringify({ source: zenEditor.getValue(), option: Playground.CodeGenTarget }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                outputViewer.setValue(res.source);
                outputViewer.clearSelection();
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
        timer = setTimeout(GenerateServer, 400);
    });

    var TargetNames = ["JavaScript", "Python", "Erlang", "C", "LLVM"];
    var TargetOptions = ["js", "py", "erlang", "c", "llvm"];
    var TargetMode = ["javascript", "python", "erlang", "c_cpp", "assembly_x86"];

    var bind = function (n) {
        var Target = $('#Target-' + TargetNames[n]);
        Target.click(function () {
            Playground.CodeGenTarget = TargetOptions[n];
            $('li.active').removeClass("active");
            Target.parent().addClass("active");
            $('#active-lang').text(TargetNames[n]);
            $('#active-lang').append('<b class="caret"></b>');
            Playground.ChangeSyntaxHighlight(outputViewer, TargetMode[n]);
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            GenerateServer();
        });
    };

    for (var i = 0; i < TargetNames.length; i++) {
        $("#Targets").append('<li id="Target-' + TargetNames[i] + '-li"><a href="#" id="Target-' + TargetNames[i] + '">' + TargetNames[i] + '</a></li>');
        bind(i);
    }

    $("#Target-JavaScript-li").addClass("active");
});
