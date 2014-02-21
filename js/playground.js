$(function () {

	var PlayGround_CodeGenTarget = "js";

	var CreateEditor = function(jq, param){
		var editorSize = { width: jq.width(), height: jq.height() };
		var scriptCodeMirror = CodeMirror.fromTextArea(jq[0]);
		scriptCodeMirror.setSize(editorSize.width, editorSize.height);
		return scriptCodeMirror;
	}


	var editor_gs = CreateEditor($("#editor-gs"), {
		lineNumbers: true,
		mode: "text/x-csrc",
		placeholder: "Type something...",
		});
	var editor_js = CreateEditor($("#editor-js"), {
		lineNumbers: true,
		placeholder: "Generated code goes here...",
		readOnly: true,
		mode: "text/x-csrc"});

	var Generate = function(){
		try{
			var src = editor_gs.getValue();
			LibGreenTea.Program = "";
			LibGreenTea.WriteCode = function(OutputFile, SourceCode) {
				this.Program = this.Program + SourceCode;
			};
			var Generator = LibGreenTea.CodeGenerator(PlayGround_CodeGenTarget, "-", 0);
			var Context = new GtParserContext(new KonohaGrammar(), Generator);
			DebugPrintOption = true;
			Context.TopLevelNameSpace.Eval(src);
			Generator.FlushBuffer();
			var generatedCode = LibGreenTea.Program;
			editor_js.setValue(generatedCode);
			var error = Context.GetReportedErrors().join("<br>");
			$("#editor-error").html(error.length == 0 ? "No Error" : error);
		}catch(e){
			var error = e.toString();
			if(Context){
				error = "JavaScript Error:<br>"+ error + "<br>----<br>" + Context.GetReportedErrors().join("<br>");
			}
			$("#editor-error").html(error);
			editor_js.setValue("");
			throw e;
		}
	}

	var timer = null;

	editor_gs.on("change", function(cm, obj) {
		if(timer){
			clearTimeout(timer);
			timer = null;
		}
		timer = setTimeout(Generate, 200);
	});

	var TargetNames   = ["JavaScript", /*"Java",*/ "Perl", "Python", "Bash", "C"];
	var TargetOptions = ["js", /*"java",*/ "perl", "python", "bash", "c"];

	var bind = function(n){
		var Target = $('#Tatget-' + TargetNames[n]);
		Target.click(function(){
			PlayGround_CodeGenTarget = TargetOptions[n];
			$('li.active').removeClass("active");
			Target.parent().addClass("active");
			if(timer){
				clearTimeout(timer);
				timer = null;
			}
			Generate();
		});
	}

	for(var i = 0; i < TargetNames.length; i++){
		$("#Targets").append('<li><a href="#" id="Tatget-'+TargetNames[i]+'">'+TargetNames[i]+'</a></li>');
		bind(i);
	}
});
