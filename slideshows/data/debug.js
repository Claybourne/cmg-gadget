var items = [

        {
            "title": "Bespoke solutions",
            "description": "Combining the best of both technology and business. Listening to clients and understanding what is required. Creating phased deliverables to simplify and assist with rapid Return On Investment. Minimising risk through prototyping and test driven development.",
            "image": "https://cmg-gadget.googlecode.com/git/img/banner/banner-1.png",
            "thumb": "https://cmg-gadget.googlecode.com/git/slideshows/img/major/s2t.jpg",
            "link": "https://sites.google.com/a/c-mg.com/sites-template-development/",
            "background": "#ebe6e0",
            "color": "#000000"
        },
        {
            "title": "We develop exceptional solutions to improve performance in outstanding businesses",
            "description": "We pride ourselves on finding simple ways to solve difficult problems",
            "image": "https://cmg-gadget.googlecode.com/git/img/banner/banner-2.png",
            "thumb": "https://cmg-gadget.googlecode.com/git/slideshows/img/major/s3t.jpg",
            "link": "https://sites.google.com/a/c-mg.com/sites-template-development/",
            "background": "#c8bcb0",
            "color": "#000000"
        },
        {
            "title": "Mobile solutions",
            "description": "Our client's request speed and our teams deliver by coding in the native OS. Mobile development means designing & building for multiple screen resolutions. We have been in mobile for 10 years, from PDAs to Smart-Phones. We have developed financial tools, games and analytic tools. Our automated testing framework tests Apps on over 40 devices.",
            "image": "https://cmg-gadget.googlecode.com/git/img/banner/banner-3.png",
            "thumb": "https://cmg-gadget.googlecode.com/git/slideshows/img/major/s4t.jpg",
            "link": "https://sites.google.com/a/c-mg.com/sites-template-development/",
            "background": "#cabeb0",
            "color": "#000000"
        }

    ];

    defaultOptions = function() {
        return {
            $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
                    $AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
                $PauseOnHover: 1,                                   //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, default value is 1

                $ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
                $SlideDuration: 800,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
                $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
                //$SlideWidth: 920,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
                //$SlideHeight: 390,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
                $SlideSpacing:0, 					                //[Optional] Space between each slide in pixels, default value is 0
                $DisplayPieces: 1,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
                $ParkingPosition: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
                $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
                $PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, default value is 1
                $DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

                $ArrowNavigatorOptions: {                       //[Optional] Options to specify and enable arrow navigator or not
                     $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
                    $ChanceToShow: 1,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                    $AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                    $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
                },

            $ThumbnailNavigatorOptions: {
                $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
                        $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                        $ActionMode: 1,                                 //[Optional] 0 None, 1 act by click, 2 act by mouse hover, 3 both, default value is 1
                        $AutoCenter: 0,                                 //[Optional] Auto center thumbnail items in the thumbnail navigator container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 3
                        $Lanes: 1,                                      //[Optional] Specify lanes to arrange thumbnails, default value is 1
                        $SpacingX: 3,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
                        $SpacingY: 3,                                   //[Optional] Vertical space between each thumbnail in pixel, default value is 0
                        $DisplayPieces: 9,                              //[Optional] Number of pieces to display, default value is 1
                        $ParkingPosition: 260,                          //[Optional] The offset position to park thumbnail
                        $Orientation: 1,                                //[Optional] Orientation to arrange thumbnails, 1 horizental, 2 vertical, default value is 1
                        $DisableDrag: false                            //[Optional] Disable drag or not, default value is false
            }
        }
    };

var defaultConfig = {
    autoResize: true,
    slideWidth: 920,
    slideHeight: 390
}