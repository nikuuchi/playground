///<reference path='./typings/jquery/jquery.d.ts' />
declare var ace: any;

module Playground {
    export function CreateEditor(query: string): any {
        var editor = ace.edit(query);
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/javascript");
        return editor;
    }
}

$(() => {
    var zenEditor = Playground.CreateEditor("zen-editor");
    var outputViewer = Playground.CreateEditor("output-viewer");
    outputViewer.setReadOnly(true);

    var Generate = ()=> {
        outputViewer.getSession().setMode("ace/mode/css");
        outputViewer.setValue(zenEditor.getValue());
    }

    var timer: number = null;
    zenEditor.on("change", function(cm, obj) {
        if(timer){
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(Generate, 200);
    });
});
