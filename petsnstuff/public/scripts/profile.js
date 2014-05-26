$(function() {
         var tabTitle = $( "#tab_title" ),
           tabContent = $( "#tab_content" ),
           tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
           tabCounter = 2;
           var tabs = $( "#tabs" ).tabs();


          //This adds the custom buttons and a close callback reseting the form inside
          var dialog = $( "#dialog" ).dialog({
            autoOpen: false,
            modal: true,
            buttons: {
              Add: function() {
                addTab();
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


          //This calls the addTab function on submit and closed the box/dialog
          var form = dialog.find( "form" ).submit(function( event ) {
            addTab();
            dialog.dialog( "close" );
            event.preventDefault();
          });


    //The function below adds a new tab using the input from the form that is created above
    function addTab() {
      var label = tabTitle.val() || "Tab " + tabCounter,
        id = "tabs-" + tabCounter,
        li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
        tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";
        tabs.find( ".ui-tabs-nav" ).append( li );
        tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
      tabs.tabs( "refresh" );
      tabCounter++;
    }

    // This opens the dialog
    $( "#add_tab" )
      .button()
      .click(function() {
        dialog.dialog( "open" );
      });

    // This function closes the new tab
    //Need to change the live () method to more recent...perhaps .on()
    $( "#tabs span.ui-icon-close" ).on( "click", function() {
      var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
      $( "#" + panelId ).remove();
      tabs.tabs( "refresh" );
    });
  });