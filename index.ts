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

    var Generate = () => {
        outputViewer.setValue(zenEditor.getValue());
        outputViewer.clearSelection();
    };

    var timer: number = null;
    zenEditor.on("change", function(cm, obj) {
        if(timer){
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(Generate, 200);
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
            Generate();
        });
    };

    for(var i = 0; i < TargetNames.length; i++){
        $("#Targets").append('<li id="Target-'+TargetNames[i]+'-li"><a href="#" id="Target-'+TargetNames[i]+'">'+TargetNames[i]+'</a></li>');
        bind(i);
    }

    $("#Target-JavaScript-li").addClass("active");
});
