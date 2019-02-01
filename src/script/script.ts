import * as $ from "jquery";
import { Foundation, DropdownMenu } from "foundation-sites"

//import "foundation-sites/js/foundation.dropdown.js"
//import dropdown from "foundation-sites/js/dropdown"
//import * as dropdown from "foundation-sites/js/foundation.dropdown"

$(function () {

    Foundation.addToJquery($);

    //console.log($(document).foundation());

    //new Foundation.Dropdown($("#test"));


    const img = $("#visionneuse-img");
    const content = $('#visionneuse-content');

    $("#visionneuse-content").click(function (e) {
        e.stopImmediatePropagation();
    })
    $("#visionneuse-close,#visionneuse").click(function () {
        $("#visionneuse").fadeOut(500);
        $("body").removeClass("modal-open");
    });

    let index: number;
    let all: string[];

    $(".visionneuse-reveal").click(function () {
        $("body").addClass("modal-open");

        index = parseInt($(this).attr("data-index"));

        if (isNaN(index)) {
            all = [];
        } else {
            all = $("#" + $(this).attr("data-all")).attr("data-src").split(',');
        }

        visionneuse($(this).attr("data-src"));
    });

    function visionneuse(src: string) {
        img.attr("src", src);

        $("#visionneuse").fadeIn(500);
        content.css("visibility", "hidden");

        img.one("load", function () {

            let viewPort = {
                width: window.innerWidth - 100,
                height: window.innerHeight - 100
            };

            content.width(viewPort.width);

            const imgSize = {
                width: img.width(),
                height: img.height()
            }

            const imgRatio = imgSize.width / imgSize.height;
            const portRatio = viewPort.width / viewPort.height;

            if (imgRatio < portRatio) {
                content.width(viewPort.height * imgSize.width / imgSize.height);
            }

            if (all.length <= 1) {
                $("#visionneuse-next,#visionneuse-prev").hide();
            } else {
                $("#visionneuse-next,#visionneuse-prev").show();
                $("#visionneuse-next,#visionneuse-prev").css('top', content.height() / 3);
            }

            content.css("visibility", "visible");
        });


    };

    /**
     * Click on next
     */
    $("#visionneuse-next").click(function () {
        if (index === all.length - 1) index = -1;

        visionneuse(all[++index]);
    });

    /**
     * Click on previous
     */
    $("#visionneuse-prev").click(function () {
        if (index === 0) index = all.length;

        visionneuse(all[--index]);
    });
})