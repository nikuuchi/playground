///<reference path='./typings/jquery/jquery.d.ts' />
declare var ace: any;

module Playground {
    export var CodeGenTarget = "js";

    export function CreateEditor(query: string): any {
        var editor = ace.edit(query);
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/javascript");
        return editor;
    }

    export function ChangeSyntaxHighlight(editor: any, targetMode: string): void {
        editor.getSession().setMode("ace/mode/" + targetMode);
    }
}

$(() => {
    var zenEditor = Playground.CreateEditor("zen-editor");
    var outputViewer = Playground.CreateEditor("output-viewer");
    outputViewer.setReadOnly(true);

    //var Generate = () => {
    //    outputViewer.setValue(zenEditor.getValue());
    //    outputViewer.clearSelection();
    //};

    var GenerateServer = () => {
        $.ajax({
            type: "POST",
            url: "cgi-bin/compile.cgi",
            data: JSON.stringify({source: zenEditor.getValue(), option: Playground.CodeGenTarget}),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: (res) => {
                outputViewer.setValue(res.source);
                outputViewer.clearSelection();
            },
            error: () => {
                console.log("error");
            }
        });
    }

    var timer: number = null;
    zenEditor.on("change", function(cm, obj) {
        if(timer){
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(GenerateServer, 400);
    });

    var TargetNames   = ["JavaScript", "Python", "Erlang", "C"];
    var TargetOptions = ["js", "python", "erlang", "c"];
    var TargetMode    = ["javascript", "python", "erlang", "c_cpp"];

    var bind = (n) => {
        var Target = $('#Target-' + TargetNames[n]);
        Target.click(function(){
            Playground.CodeGenTarget = TargetOptions[n];
            $('li.active').removeClass("active");
            Target.parent().addClass("active");
            Playground.ChangeSyntaxHighlight(outputViewer, TargetMode[n]);
            if(timer){
                clearTimeout(timer);
                timer = null;
            }
            GenerateServer();
        });
    };

    for(var i = 0; i < TargetNames.length; i++){
        $("#Targets").append('<li id="Target-'+TargetNames[i]+'-li"><a href="#" id="Target-'+TargetNames[i]+'">'+TargetNames[i]+'</a></li>');
        bind(i);
    }

    $("#Target-JavaScript-li").addClass("active");
});
