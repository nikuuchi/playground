///<reference path='./typings/jquery/jquery.d.ts' />
declare var ace: any;

$(() => {
    var Leditor = ace.edit("editor-left");
    Leditor.setTheme("ace/theme/xcode");
    Leditor.getSession().setMode("ace/mode/javascript");

    var Reditor = ace.edit("editor-right");
    Reditor.setReadOnly(true);
    Reditor.setTheme("ace/theme/xcode");
    Reditor.getSession().setMode("ace/mode/javascript");

    $("#compile-btn").click((event: MouseEvent) => {
        var value = Leditor.getValue();
        Reditor.setValue(value);
    });
});
