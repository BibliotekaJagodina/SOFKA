/*
 * Style File - jQuery plugin for styling file input elements
 *
 * Copyright (c) 2007-2008 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Based on work by Shaun Inman
 *   http://www.shauninman.com/archive/2007/09/10/styling_file_inputs_with_css_and_the_dom
 *
 * Revision: $Id: jquery.filestyle.js 303 2008-01-30 13:53:24Z tuupola $
 *
 */

function pathinfo (path, options) {
    // Returns information about a certain string
    //
    // version: 1008.1718
    // discuss at: http://phpjs.org/functions/pathinfo    // +   original by: Nate
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    improved by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
    // %        note 1: The way the bitwise arguments are handled allows for greater flexibility    // %        note 1: & compatability. We might even standardize this code and use a similar approach for
    // %        note 1: other bitwise PHP functions
    // %        note 2: php.js tries very hard to stay away from a core.js file with global dependencies, because we like
    // %        note 2: that you can just take a couple of functions and be on your way.
    // %        note 2: But by way we implemented this function, if you want you can still declare the PATHINFO_*    // %        note 2: yourself, and then you can use: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
    // %        note 2: which makes it fully compliant with PHP syntax.
    // -    depends on: dirname
    // -    depends on: basename
    // *     example 1: pathinfo('/www/htdocs/index.html', 1);    // *     returns 1: '/www/htdocs'
    // *     example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME');
    // *     returns 2: 'index.html'
    // *     example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION');
    // *     returns 3: 'html'    // *     example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME');
    // *     returns 4: 'index'
    // *     example 5: pathinfo('/www/htdocs/index.html', 2 | 4);
    // *     returns 5: {basename: 'index.html', extension: 'html'}
    // *     example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL');    // *     returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
    // *     example 7: pathinfo('/www/htdocs/index.html');
    // *     returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
    // Working vars
    var opt = '', optName = '', optTemp = 0, tmp_arr = {}, cnt = 0, i=0;var have_basename = false, have_extension = false, have_filename = false;

    // Input defaulting & sanitation
    if (!path) {return false;}
    if (!options) {options = 'PATHINFO_ALL';}
    // Initialize binary arguments. Both the string & integer (constant) input is
    // allowed
    var OPTS = {
        'PATHINFO_DIRNAME': 1,        'PATHINFO_BASENAME': 2,
        'PATHINFO_EXTENSION': 4,
        'PATHINFO_FILENAME': 8,
        'PATHINFO_ALL': 0
    };    // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
    for (optName in OPTS) {
        OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
    }
    if (typeof options !== 'number') { // Allow for a single string or an array of string flags        options = [].concat(options);
        for (i=0; i < options.length; i++) {
            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
            if (OPTS[options[i]]) {
                optTemp = optTemp | OPTS[options[i]];}
        }
        options = optTemp;
    }
     // Internal Functions
    var __getExt = function (path) {
        var str  = path+'';
        var dotP = str.lastIndexOf('.')+1;
        return str.substr(dotP);};


    // Gather path infos
    if (options & OPTS.PATHINFO_DIRNAME) {tmp_arr.dirname = this.dirname(path);
    }

    if (options & OPTS.PATHINFO_BASENAME) {
        if (false === have_basename) {have_basename = this.basename(path);
        }
        tmp_arr.basename = have_basename;
    }
     if (options & OPTS.PATHINFO_EXTENSION) {
        if (false === have_basename) {
            have_basename = this.basename(path);
        }
        if (false === have_extension) {have_extension = __getExt(have_basename);
        }
        tmp_arr.extension = have_extension;
    }
     if (options & OPTS.PATHINFO_FILENAME) {
        if (false === have_basename) {
            have_basename = this.basename(path);
        }
        if (false === have_extension) {have_extension = __getExt(have_basename);
        }
        if (false === have_filename) {
            have_filename  = have_basename.substr(0, (have_basename.length - have_extension.length)-1);
        }
        tmp_arr.filename = have_filename;
    }

     // If array contains only 1 element: return string
    cnt = 0;
    for (opt in tmp_arr){
        cnt++;
    }if (cnt == 1) {
        return tmp_arr[opt];
    }
    // Return full-blown array    return tmp_arr;
}


function basename (path, suffix) {
    // Returns the filename component of the path
    //
    // version: 1008.1718
    // discuss at: http://phpjs.org/functions/basename    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Ash Searle (http://hexmen.com/blog/)
    // +   improved by: Lincoln Ramsay
    // +   improved by: djmix
    // *     example 1: basename('/www/site/home.htm', '.htm');    // *     returns 1: 'home'
    // *     example 2: basename('ecra.php?p=1');
    // *     returns 2: 'ecra.php?p=1'
    var b = path.replace(/^.*[\/\\]/g, '');
        if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix) {
        b = b.substr(0, b.length-suffix.length);
    }

    return b;
}

(function($) {

    $.fn.filestyle = function(options, title, pogresnaEkstenzija) {

        /* TODO: This should not override CSS. */
        var settings = {
            width : 250
        };

        if(options) {
            $.extend(settings, options);
        };

        return this.each(function() {

            var self = this;
            var wrapper = $("<div>")
                            .css({
                                "width": settings.imagewidth + "px",
                                "height": settings.imageheight + "px",
                                "background": "url(" + settings.image + ") 0 0 no-repeat",
                                "background-position": "right",
                                "display": "inline",
                                "position": "absolute",
                                "overflow": "hidden"
                            });

            var filename = $('<input class="file" title="'+title+'" readonly>')
                             .addClass($(self).attr("class"))
                             .css({
                                 "display": "inline",
                                 "width": settings.width + "px"
                             });

            $(self).before(filename);
            $(self).wrap(wrapper);

            $(self).css({
                        "position": "relative",
                        "height": settings.imageheight + "px",
                        "width": settings.width + "px",
                        "display": "inline",
                        "cursor": "pointer",
                        "opacity": "0.0"
                    });

             if ($.browser.mozilla) {
                if (/Win/.test(navigator.platform)) {
                    $(self).css("margin-left", "-142px");
                } else {
                    $(self).css("margin-left", "-168px");
                };
            } else {
                $(self).css("margin-left", settings.imagewidth - settings.width + "px");
            };
            $(self).bind("change", function() {
                var vrednost = $(self).val();
                var ekstenzija = pathinfo(vrednost,4);
                ekstenzija = ekstenzija.toLowerCase();
                if(ekstenzija != 'jpg' && ekstenzija != 'png' && ekstenzija != 'gif' && ekstenzija != 'jpeg')
                {
                    alert(pogresnaEkstenzija);
                }
                filename.val(basename(vrednost));
            });

        });


    };

})(jQuery);
