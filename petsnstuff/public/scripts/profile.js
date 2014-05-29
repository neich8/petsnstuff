$(function() {
  $( "#tabs" ).tabs();
  //This adds the custom buttons and a close callback reseting the form inside
  var dialog = $( "#dialog" ).dialog({
    autoOpen: false,
    modal: true,
    width: 400,
    height: 'auto',
    resizable: false,
    show: { effect: "puff",
    duration: 500 },
    buttons: {
      Add: function() {

        $.ajax({
          url: "/create",
          method: "post",
          data: {
            petName: $('#pet_submission').find("#petName").val(),
            age: $('#pet_submission').find("#age").val(),
            weight: $('#pet_submission').find("#weight").val(),
            license: $('#pet_submission').find("#license").val(),
            breed: $('#pet_submission').find("#breed").val(),
            markings: $('#pet_submission').find("#markings").val(),
            shotName: $('#pet_submission').find("#shotName").val(),
            shotDate: $('#pet_submission').find("#shotDate").val(),
            photo: "https://s3.amazonaws.com/pets-n-stuff/nyancat.gif"
          },
          success: function(response) {
            addTab(response.pet);
             window.location.href = '/profile';
          }
        });
        $( this ).dialog( "close" );

      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    },
    close: function() {
      form[ 0 ].reset();
    }
  });

  // This opens the dialog
  $( "#add_tab" )
    // .button()
    .click(function() {
    dialog.dialog( "open" );
  });

  //This calls the addTab function on submit and closes the box/dialog
  var form = dialog.find( "form" ).submit(function( event ) {
    addTab();
    dialog.dialog( "close" );
    event.preventDefault();
  });

  function addTab(pet){
    var tab_number = $("#tabs ul").children().length + 1
    $("#tabs ul").prepend("<li><a href='#tabs-" + tab_number + "'>" + pet.name + "</a><span class='remove' data-pet='"+ pet.id +
     "' data-tab='"+ tab_number +"'>x</span></li>")
    $("#tabs").append("<div id='tabs-" + tab_number + "'>" + pet.markings + "</div>")
    $("div#tabs").tabs("refresh")
    $("#tabs ul").load("refresh")
  }


  if ($("#active_tab").html() != "") {
    $( "div#tabs").tabs( "option", "active", parseInt( $("#active_tab").html() ) );
  }

  $(".remove").click(function(){
    var check = confirm("Really delete this pet profile?");
    if (check != false) {
      var id = $(this).attr("data-tab")
      $.ajax({
        url: "/delete",
        method: "post",
        data: {
          petid: $(this).attr("data-pet"),
        },
        success: function(response) {
          $( $("#tabs-" + id) ).remove().attr( "aria-controls" );
          $( $("#tab_" + id + "_header") ).remove();
          $("div#tabs").tabs("refresh")
        }
      });
    }
  })

  $("input[data=required]").bind("change", function() {
    checkValidation()
  })
});

 function checkValidation() {
  console.log("HERE")
        if ($('#petName').val() != "") {
            $('#name_validation').attr('class', 'hidden');
        }
        if ($('#age').val() != "")
            $('#age_validation').attr('class', 'hidden');

        if ($('#breed').val() != "")
            $('#breed_validation').attr('class', 'hidden');

        if ($('#weight').val() != "")
            $('#weight_validation').attr('class', 'hidden');

        // if ($('#ZDticket').val().match(/\b\d{7}\b/))
        //     $('#validateTicket').css('display', 'none');

        // if ($('#timeHours option:selected').text() != "Hours" && $('#timeMinutes option:selected').text() != "Minutes")
        //     $('#validateTime').css('display', 'none');

        // if ($('#siteEditor option:selected').text() != "Assignee" ) {
        //     $('#validateSEName').css('display', 'none');
        //     var cookie = $('#siteEditor option:selected').text();
        //     document.cookie = cookie + '; expires=Fri, 3 Aug 2100 20:47:11 UTC; path=/';
        // }

        // if ($('#WM').is(':checked') || $('#WM1').is(':checked'))
        //     $('#validateApproval').css('display', 'none');

        // if ($('#validations').children(':visible').length == 0) {
        //     $('#validations').css('display', 'none');
        //     $('#generateNote').attr('disabled', false);
        // }
    }


