var currentPos = 1;
var debug = 0;
var prefs;
if (typeof gadgets != "undefined") {
    debug = 1;
    prefs = new gadgets.Prefs();
}

function showMessage(mType, bigText, smallText) {
    $("#message").html(
        [
            '<div class="alert alert-',
            mType,
            ' alert-dismissable">',
             '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>',
              '<strong>',
            bigText,
            '</strong> ',
            smallText,
            '</div>'
        ].join("")
    );
    adjustHeight();
}

function adjustHeight() {
    if (debug == 0) return;
    if (typeof gadgets.window != 'undefined') {
        gadgets.window.adjustHeight();
    }
}


function hideLoading() {
    $("#pos2").hide();
    $("#pos3").hide();
    $(".loading").remove();
    adjustHeight();
}

function validationForm(data) {
    var requiredFields = new Array();
    $(".alert-dismissable").remove();
    $(".form-group").removeClass("has-feedback");
    $(".form-group").removeClass("has-error");
    var validEmail = true;
    if (data.firstName.length == 0) {
        $("#txtFirstName").parent().addClass("has-error");
        $("#txtFirstName").parent().addClass("has-feedback");
        $("#txtFirstName").focus();
        requiredFields.push("First name");
    }
    if (data.lastName.length == 0) {
        $("#txtLastName").parent().addClass("has-error");
        $("#txtLastName").parent().addClass("has-feedback");
        $("#txtLastName").focus();
        requiredFields.push("Last name");
    }
    if (data.email.length == 0) {
        $("#txtEmail").parent().addClass("has-error");
        $("#txtEmail").parent().addClass("has-feedback");
        $("#txtEmail").focus();
        requiredFields.push("Email");
    } else {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(data.email)) {
            $("#txtEmail").parent().addClass("has-error");
            $("#txtEmail").parent().addClass("has-feedback");
            $("#txtEmail").focus();
            validEmail = false;
        }
    }
    if (data.message.length == 0) {
        $("#txtMessage").parent().addClass("has-error");
        $("#txtMessage").parent().addClass("has-feedback");
        $("#txtMessage").focus();
        requiredFields.push("Message");
    }
    if (requiredFields.length > 0) {
        showMessage('danger',"Missing required field:", requiredFields.join(", "));
        return false;
    } else if (!validEmail) {
        showMessage('danger',"Invalid email address!", "ex: username@domain.com");
        return false;
    }

    return true;
}

$(document).ready(function() {

   $(".bullet-item").click(function(e) {
        var pos = $(this).attr("pos");
        if (pos != currentPos) {
            $(".bullet-item").removeClass("av");
            $(this).addClass("av");
            currentPos = pos;
            $(".div-pos").hide();
            $("#pos" + pos).show();
            adjustHeight();
        }
   });
    $("#frmContact").submit(function(e) {

        var data = {};
        data.firstName = $("#txtFirstName").val().trim();
        data.lastName = $("#txtLastName").val().trim();
        data.email = $("#txtEmail").val().trim();
        data.message = $("#txtMessage").val().trim();
        data.happy = $("#cbxHappy").is(':checked');
        data.member = $("#cbxMember").is(':checked');
        if (validationForm(data) && debug == 1) {
            var params = {};
            params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
            params[gadgets.io.RequestParameters.POST_DATA] = JSON.stringify(data);
            gadgets.io.makeRequest(
                prefs.getString("FormURL"),
                function(obj) {
                    if (typeof obj.text != 'undefined') {
                        showMessage('info',"Your contact form has been submitted successfully", "");
                        $("#txtFirstName").val("");
                        $("#txtLastName").val("");
                        $("#txtEmail").val("");
                        $("#txtMessage").val("");
                        $('#cbxHappy').prop('checked', false);
                        $('#cbxMember').prop('checked', false);
                    } else {
                        showMessage('danger',"Could not complete your request", "Please try again later");
                    }
                },
                params
            );
        }
        return false;
    });

    if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
        $(window).bind('resize', adjustHeight);
    }
    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
        $(window).bind("orientationchange", adjustHeight);
    }


    setTimeout(hideLoading, 1500);
});