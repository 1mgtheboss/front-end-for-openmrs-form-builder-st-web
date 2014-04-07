$(function() {
    $("#bodyPost").empty();
    var n = 0;
    $("#bodyPost").append("<center><input type='image' src='img/add-form-btn.png' id='add-form-btn' ><input type='image' src='img/post-btn.png' id='post-btn' ><input type='image' src='img/restart-btn.png' id='restart-btn-post' ></center>");
    $('input#restart-btn-post').click(function() {
        FB.container.setActiveItem(0);
        FB.container.setActiveItem(1);
    });
    $('input#add-form-btn').click(function() {
        $('input#add-form-btn').attr("disabled", true);
        $("#bodyPost").append("<center><br>Form name:&nbsp;&nbsp;<input type='text' id='form-name'>&nbsp;&nbsp;Created By:&nbsp;&nbsp;<input type='text' id='form-creators-name'><br><br><input type='image' src='img/add-field-btn.png' id='add-field-btn' ></center>");
        $('input#add-field-btn').click(function() {
            n++;
            $("#bodyPost").append("<center><br>Field name:&nbsp;&nbsp;<input type='text' id='" + n + "'>Concept Class:&nbsp;&nbsp;<select id='cc-" + n + "' ><option value='8d4907b2-c2cc-11de-8d13-0010c6dffd0f'>Test</option><option value='8d490bf4-c2cc-11de-8d13-0010c6dffd0f'>Procedure</option><option value='8d490dfc-c2cc-11de-8d13-0010c6dffd0f'>Drug</option><option value='8d4918b0-c2cc-11de-8d13-0010c6dffd0f'>Diagnosis</option><option value='8d491a9a-c2cc-11de-8d13-0010c6dffd0f'>Finding</option><option value='8d491c7a-c2cc-11de-8d13-0010c6dffd0f'>Anatomy</option><option value='8d491e50-c2cc-11de-8d13-0010c6dffd0f'>Question</option><option value='8d492026-c2cc-11de-8d13-0010c6dffd0f'>LabSet</option><option value='8d4923b4-c2cc-11de-8d13-0010c6dffd0f'>MedSet</option><option value='8d492594-c2cc-11de-8d13-0010c6dffd0f'>ConvSet</option><option value='8d492774-c2cc-11de-8d13-0010c6dffd0f'>Misc</option><option value='8d492954-c2cc-11de-8d13-0010c6dffd0f'>Symptom</option><option value='8d492b2a-c2cc-11de-8d13-0010c6dffd0f'>Symptom/Finding</option><option value='8d492d0a-c2cc-11de-8d13-0010c6dffd0f'>Specimen</option><option value='8d492ee0-c2cc-11de-8d13-0010c6dffd0f'>Misc Order</option></select>Concept Data Type:&nbsp;&nbsp;<select id='cdt-" + n + "' ><option value='8d4a4488-c2cc-11de-8d13-0010c6dffd0f'>Numeric</option><option value='8d4a48b6-c2cc-11de-8d13-0010c6dffd0f'>Coded</option><option value='8d4a4ab4-c2cc-11de-8d13-0010c6dffd0f'>Text</option><option value='8d4a4c94-c2cc-11de-8d13-0010c6dffd0f'>N/A</option><option value='8d4a505e-c2cc-11de-8d13-0010c6dffd0f'>Date</option><option value='8d4a591e-c2cc-11de-8d13-0010c6dffd0f'>Time</option><option value='8d4a5af4-c2cc-11de-8d13-0010c6dffd0f'>Datetime</option></select><br>Answers:<br><textarea  id='a-" + n + "'></textarea><br><input type='checkbox' id='sm-" + n + "'>Select Multiple</center>");
        });
    });
    $('input#post-btn').click(function() {
        var formUUID;
        var formData = new Object();
        if ($('#form-creators-name').val() !== "") formData.name = $('#form-name').val().split("[").join("_").split("]").join("_") + "[" + $('#form-creators-name').val() + "]";
        else formData.name = $('#form-name').val().split("[").join("_").split("]").join("_");
        formData.version = "0.1";
        var sFormData = JSON.stringify(formData);
        $.ajax({
            type: "POST",
            url: "http://localhost:8081/openmrs-standalone/ws/rest/v1/form",
            contentType: "application/json",
            data: sFormData,
            success: function(data) {
                formUUID = data.uuid;
                for (var i = 1; i <= n; i++) {
                    var answers = new Array();
                    var answersUUID = new Array();
                    answers = $("#a-" + i).val().split("\n");
                    for (var j = 0; j < answers.length; j++) {
                        if (answers[j] === "") continue;
                        var answerData = new Object();
                        answerData.names = new Array();
                        var temp = new Object();
                        temp.name = answers[j];
                        temp.locale = "en";
                        temp.conceptNameType = "FULLY_SPECIFIED";
                        answerData.names.push(temp);
                        answerData.datatype = "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f";
                        answerData.conceptClass = "8d492774-c2cc-11de-8d13-0010c6dffd0f";
                        var sAnswerData = JSON.stringify(answerData);
                        console.log(sAnswerData);
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:8081/openmrs-standalone/ws/rest/v1/concept",
                            contentType: "application/json",
                            data: sAnswerData,
                            success: function(data) {
                                answersUUID.push(data.uuid);
                            },
                            async: false
                        });
                    }
                    var conceptData = new Object();
                    var conceptUUID;
                    conceptData.names = new Array();
                    var temp1 = new Object();
                    temp1.name = $("#" + i).val();
                    temp1.locale = "en";
                    temp1.conceptNameType = "FULLY_SPECIFIED";
                    conceptData.names.push(temp1);
                    conceptData.datatype = $("#cdt-" + i).val();
                    conceptData.conceptClass = $("#cc-" + i).val();
                    if (answers.length !== 0) conceptData.answers = answersUUID;
                    var sConceptData = JSON.stringify(conceptData);
                    console.log(sConceptData);
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8081/openmrs-standalone/ws/rest/v1/concept",
                        contentType: "application/json",
                        data: sConceptData,
                        success: function(data) {
                            conceptUUID = data.uuid;
                        },
                        async: false
                    });
                    var fieldData = new Object();
                    var fieldUUID;
                    fieldData.name = $("#" + i).val();
                    fieldData.fieldType = "8d5e7d7c-c2cc-11de-8d13-0010c6dffd0f";
                    fieldData.concept = conceptUUID;
                    fieldData.selectMultiple = document.getElementById("sm-" + i).checked;
                    var sFieldData = JSON.stringify(fieldData);
                    console.log(sFieldData);
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8081/openmrs-standalone/ws/rest/v1/field",
                        contentType: "application/json",
                        data: sFieldData,
                        success: function(data) {
                            fieldUUID = data.uuid;
                        },
                        async: false
                    });
                    var formFieldData = new Object();
                    formFieldData.form = formUUID;
                    formFieldData.field = fieldUUID;
                    formFieldData.required = false;
                    var sFormFieldData = JSON.stringify(formFieldData);
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8081/openmrs-standalone/ws/rest/v1/form/" + formUUID + "/formfield",
                        contentType: "application/json",
                        data: sFormFieldData,
                        async: false
                    });
                }
            }
        });
    });
});