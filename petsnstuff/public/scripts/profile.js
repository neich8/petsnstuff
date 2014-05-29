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
    $("#tabs ul").prepend("<li><a href='#tabs-" + tab_number + "'>" + pet.name + "</a></li>")
    $("#tabs").append("<div id='tabs-" + tab_number + "'>" + pet.markings + "</div>")
    $("div#tabs").tabs("refresh")
  }
});
