///<reference path='./typings/jquery/jquery.d.ts' />

$(function () {
    var Leditor = ace.edit("editor-left");
    Leditor.setTheme("ace/theme/xcode");
    Leditor.getSession().setMode("ace/mode/javascript");
    var Reditor = ace.edit("editor-right");
    Reditor.setTheme("ace/theme/xcode");
    Reditor.getSession().setMode("ace/mode/javascript");
});
