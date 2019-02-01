"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const foundation_sites_1 = require("foundation-sites");
$(function () {
    foundation_sites_1.Foundation.addToJquery($);
    const img = $("#visionneuse-img");
    const content = $('#visionneuse-content');
    $("#visionneuse-content").click(function (e) {
        e.stopImmediatePropagation();
    });
    $("#visionneuse-close,#visionneuse").click(function () {
        $("#visionneuse").fadeOut(500);
        $("body").removeClass("modal-open");
    });
    let index;
    let all;
    $(".visionneuse-reveal").click(function () {
        $("body").addClass("modal-open");
        index = parseInt($(this).attr("data-index"));
        if (isNaN(index)) {
            all = [];
        }
        else {
            all = $("#" + $(this).attr("data-all")).attr("data-src").split(',');
        }
        visionneuse($(this).attr("data-src"));
    });
    function visionneuse(src) {
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
            };
            const imgRatio = imgSize.width / imgSize.height;
            const portRatio = viewPort.width / viewPort.height;
            if (imgRatio < portRatio) {
                content.width(viewPort.height * imgSize.width / imgSize.height);
            }
            if (all.length <= 1) {
                $("#visionneuse-next,#visionneuse-prev").hide();
            }
            else {
                $("#visionneuse-next,#visionneuse-prev").show();
                $("#visionneuse-next,#visionneuse-prev").css('top', content.height() / 3);
            }
            content.css("visibility", "visible");
        });
    }
    ;
    $("#visionneuse-next").click(function () {
        if (index === all.length - 1)
            index = -1;
        visionneuse(all[++index]);
    });
    $("#visionneuse-prev").click(function () {
        if (index === 0)
            index = all.length;
        visionneuse(all[--index]);
    });
});
//# sourceMappingURL=script.js.map