$(function() {
    $("#bodyGet").empty();
    $("#bodyGet").append("<center><input type='image' src='img/toggle-ddm-btn.png' id='toggle-ddm-btn'><input type='image' src='img/restart-btn.png' id='restart-btn-get' ></center><div id='forms' style='margin-left:540px;'></div><br><br><br><br><div id='form' style='margin-left:540px;'></div>");
    var url = 'http://localhost:8081/openmrs-standalone/ws/rest/v1/form';
    $('#forms').hide();
    $('#form').hide();
    var fD = $('#forms').html("");
    $('#form').html("None selected.");
    $.get(url, function(data) {
        var dDMHTML = "<select id='formsDDM'><option value='None'>SELECT</option>";
        for (var i = 0; i < data.results.length; i++)
        dDMHTML += "<option value='" + data.results[i].uuid + "'>" + data.results[i].display + "</option>";
        dDMHTML += "</select>"
        fD.append(dDMHTML);
        $('#toggle-ddm-btn').click(function() {
            $('#forms').toggle();
            $('#form').toggle();
        });
        $('#restart-btn-get').click(function() {
            FB.container.setActiveItem(1);
            FB.container.setActiveItem(0);
        });
        $('#formsDDM').change(function() {
            $('#form').html("Loading...");
            var fUUID = $('#formsDDM').val();
            if (fUUID !== "None") {
                var formUrl = "http://localhost:8081/openmrs-standalone/ws/rest/v1/form/" + fUUID;
                var fF = new Array();
                $.get(formUrl + "?v=custom:(uuid,name,formFields)", function(data) {
                    $('#form').html("");
                    var formCreatorsName = data.name.match(/[^[\]]+(?=])/g) === null ? "None specified" : data.name.match(/[^[\]]+(?=])/g)[0];
                    var formName = data.name.replace(/\[.*\]/g, '');
                    $('#form').append(formName + "<br><br>" + "Created By:&nbsp;&nbsp;" + formCreatorsName + "<br><br>");
                    var n = data.formFields.length;
                    for (var i = 0; i < n; i++) {
                        var result = null;
                        var fieldUUID = data.formFields[i].uuid;
                        var formfieldUrl = formUrl + "/formfield/" + fieldUUID + "?v=custom:" + "%28uuid,field,sortWeight%29";
                        $.ajax({
                            url: formfieldUrl,
                            success: function(data) {
                                result = data;
                            },
                            async: false
                        });
                        fF.push(result);
                    }
                    fF.sort(function(a, b) {
                        keyA = parseFloat(a.sortWeight);
                        keyB = parseFloat(b.sortWeight);
                        return keyA - keyB;
                    });
                    for (var i = 0; i < fF.length; i++) {
                        var html = "";
                        var cData;
                        var conceptUUID = fF[i].field.concept === null ? "None" : fF[i].field.concept.uuid;
                        if (conceptUUID === "None") html = fF[i].field.display + "&nbsp;&nbsp;<input type=\"text\" id=\"" + fF[i].uuid + "\"><br>";
                        else {
                            $.ajax({
                                url: "http://localhost:8081/openmrs-standalone/ws/rest/v1/concept/" + conceptUUID,
                                success: function(data) {
                                    cData = data;
                                },
                                async: false
                            });
                            if (cData.answers.length != 0) {
                                if (fF[i].field.selectMultiple === true) {
                                    for (var j = 0; j < cData.answers.length; j++) {
                                        html += "<input type='checkbox'>" + cData.answers[j].display + "<br>";
                                    }
                                    html = "<br>" + html;
                                } else {
                                    for (var j = 0; j < cData.answers.length; j++) {
                                        html += "<option>" + cData.answers[j].display + "</option>";
                                    }
                                    html = "<select>" + html + "</select>";
                                }
                                html = fF[i].field.display + "&nbsp;&nbsp;" + html + "<br>";
                            } else {
                                html = fF[i].field.display + "&nbsp;&nbsp;<input type=\"text\" id=\"" + fF[i].uuid + "\"><br>";
                            }
                        }
                        $('#form').append(html);
                    }
                });
            } else {
                $('#form').html("None selected.");
            }
        });
    });
});