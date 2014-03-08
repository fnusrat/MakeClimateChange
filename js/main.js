
$(document).ready(function() {

    //curtisy of: http://vaughnroyko.com/fading-a-background-image-in/ 
    $('#fadeInBackground').animate({opacity: 0}, 0).css({'background-image': 'url(images/swirly-flowers.jpg)'}).animate({opacity: 1}, 2500);
    $('#fadeInBackground-projects').animate({opacity: 0}, 0).css({'background-image': 'url(images/bamboo-bright-green.jpg)'}).animate({opacity: 1}, 2500);
    $('#fadeInBackground-data').animate({opacity: 0}, 0).css({'background-image': 'url(images/lincolnheightsjail970.jpg)'}).animate({opacity: 1}, 2500);
    $('#fadeInBackground-about').animate({opacity: 0}, 0).css({'background-image': 'url(images/Aqualime.jpg)'}).animate({opacity: 1}, 2500);


    // -----------------------------------------------------------------//
    // Create the DOM list of project by getting data from a google docs 
    // form spreadhseet using YQL to get the data

    // Clean the JSON data by parsing it for "" and other horrid characters
    // The published URL of your Google Docs spreadsheet as CSV:
        var csvURL = 'https://spreadsheets.google.com/pub?key='+
            '0AjXE_b9Psh4IdHd2aDFiRm9LeEVYcENVVUdDOUpRekE&output=csv';

    // The YQL address:
        var yqlURL =    "http://query.yahooapis.com/v1/public/yql?q="+
            "select%20*%20from%20csv%20where%20url%3D'"+encodeURIComponent(csvURL)+
            "'%20and%20columns%3D'Timestamp%2CProjectName%2CProjectDescription%2CWebsiteAddress%2CImageURL%2CAddress%2CState%2CZip%2CCountry%2CEmail%2CContact'&format=json&callback=?";

    $.getJSON(yqlURL,function(msg){

        var div = $('<div>');

        // Looping through all the entries in the CSV file:
        $.each(msg.query.results.row,function(){

            // Sometimes the entries are surrounded by double quotes. This is why
            // we strip them first with the replace method:

            var Timestamp = this.Timestamp.replace(/""/g,'"').replace(/^"|"$/g,'');
            var ProjectName = this.ProjectName.replace(/""/g,'"').replace(/^"|"$/g,'');
            var ProjectDescription = this.ProjectDescription.replace(/""/g,'"').replace(/^"|"$/g,'');
            var WebsiteAddress = this.WebsiteAddress.replace(/""/g,'"').replace(/^"|"$/g,'');
            var ImageURL = this.ImageURL.replace(/""/g,'"').replace(/^"|"$/g,'');
            var Address = this.Address.replace(/""/g,'"').replace(/^"|"$/g,'');
            var State = this.State.replace(/""/g,'"').replace(/^"|"$/g,'');
            var Zip = this.Zip.replace(/""/g,'"').replace(/^"|"$/g,'');
            var Country = this.Country.replace(/""/g,'"').replace(/^"|"$/g,'');
            var Email = this.Email.replace(/""/g,'"').replace(/^"|"$/g,'');
            var Contact = this.Contact.replace(/""/g,'"').replace(/^"|"$/g,'');

            // Formatting the FAQ as a definition list: dt for the question
            // and a dd for the answer.

            div.append(
                '<div class="cf rolldown"><div class="project">'
                +ProjectName+
                '</div><div class="block maps last hidden"><div class="content"><div class="map_canvas"><div class="infotext"><div class="location">'
                +ProjectName+
               '</div><div class="address">'
               +Address+
               '</div><div class="city">'
               +State+
               '</div><div class="state">'
               +State+
               '</div><div class="zip">'
               +Zip+
               '</div><div class="country">'
               +Country+
               '</div><div class="phone"></div><div class="zoom">17</div></div></div></div></div><div Class="project-desc">'
               +ProjectDescription+
               '</div><div class="project-img">'
               +ImageURL+
               '</div></div>'
            );



        });

        // Appending the definition to the projects section :

        $('#project-section').append(div);

        // -----------------------------------------------------------------//

        // build up each of the amps and place them on the canvas
        // one for each project

        $maps = $('.block.maps .content .map_canvas');
        $maps.each(function(index, Element) {
            $infotext = $(Element).children('.infotext');

            var myOptions = {
                'zoom': parseInt($infotext.children('.zoom').text()),
                'mapTypeId': google.maps.MapTypeId.ROADMAP
            };
            var map;
            var geocoder;
            var marker;
            var infowindow;
            var address = $infotext.children('.address').text() + ', '
                    + $infotext.children('.city').text() + ', '
                    + $infotext.children('.state').text() + ' '
                    + $infotext.children('.zip').text() + ', '
                    + $infotext.children('.country').text()
            ;
            var content = '<strong>' + $infotext.children('.location').text() + '</strong><br />'
                    + $infotext.children('.address').text() + '<br />'
                    + $infotext.children('.city').text() + ', '
                    + $infotext.children('.state').text() + ' '
                    + $infotext.children('.zip').text()
            ;
            if (0 < $infotext.children('.phone').text().length) {
                content += '<br />' + $infotext.children('.phone').text();
            }

            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    myOptions.center = results[0].geometry.location;
                    map = new google.maps.Map(Element, myOptions);
                    marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        title: $infotext.children('.location').text()
                    });
                    infowindow = new google.maps.InfoWindow({'content': content});
                    google.maps.event.addListener(map, 'tilesloaded', function(event) {
                        infowindow.open(map, marker);
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                    });
                } else {
                    console.log('An address could not be found for the following reason: ' + status);
                }
            });
        });

    });

});

$(document).on('click', '.project', function(){
    
    console.log("test click");
    $(this).next('div').slideToggle();

// project menu open container
    // $('a.button').click(function(){

    //         // To expand/collapse all of the FAQs simultaneously,
    //         // just trigger the click event on the DTs

    //         if($(this).hasClass('collapse')){
    //             $('dt.opened').click();
    //         }
    //         else $('dt:not(.opened)').click();

    //         $(this).toggleClass('expand collapse');

    //         return false;
    //     });
});
   
