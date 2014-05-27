$(function() {
  $( "#tabs" ).tabs();
  //This adds the custom buttons and a close callback reseting the form inside
  var dialog = $( "#dialog" ).dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      Add: function() {
        var data = ( JSON.stringify( $('#pet_submission').serializeArray() ) );
        $.post("/create/" + data, function(response){
          console.log(response.pet)
          addTab(response.pet);
        })
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
    .button()
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
