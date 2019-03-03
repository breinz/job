"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const foundation_sites_1 = require("foundation-sites");
$(function () {
    foundation_sites_1.Foundation.addToJquery($);
    $(document).foundation();
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
        visionneuse($(this).attr("data-src"), index);
    });
    function visionneuse(src, index) {
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
                $("#visionneuse-preload").empty();
                $("#visionneuse-preload").append(`<img src="${all[index == all.length - 1 ? 0 : index + 1]}"/>`);
                $("#visionneuse-preload").append(`<img src="${all[index === 0 ? all.length - 1 : index - 1]}"/>`);
            }
            content.css("visibility", "visible");
        });
    }
    ;
    $("#visionneuse-next").click(function () {
        if (index === all.length - 1)
            index = -1;
        visionneuse(all[++index], index);
    });
    $("#visionneuse-prev").click(function () {
        if (index === 0)
            index = all.length;
        visionneuse(all[--index], index);
    });
    if ($(".ajax-pic")) {
        $('.ajax-pic').on("dragenter dragstart dragend dragleave dragover drag drop", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        $(".ajax-pic").on({
            dragenter: function (e) {
                $(this).addClass("over");
            },
            dragleave: function (e) {
                $(this).removeClass("over");
            },
            drop: function (e) {
                let that = $(this);
                $(this).removeClass("over");
                let file;
                let event = e.originalEvent;
                if (event && event.dataTransfer) {
                    file = event.dataTransfer.files[0];
                }
                if (!file) {
                    return console.log("ERROR!");
                }
                let formData = new FormData();
                formData.append("file", file, file.name);
                formData.append("upload_file", "true");
                const url = $(this).data("model");
                const item_id = $(this).data("id");
                $.post({
                    url: `/${url}/${item_id}/add_inline_pic`,
                    success: (data) => {
                        let item = $("<div class='in-pic-item'>").appendTo(".in-pics");
                        $(`<span>${$(".in-pics").children.length - 1}</span>`).appendTo(item);
                        $("<img>", { src: data, style: "max-width:100;max-height:100" }).appendTo(item);
                        $(".ajax-pic").appendTo(".in-pics");
                    },
                    error: (err) => {
                        console.log(err);
                        alert(`error`);
                    },
                    async: true,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    timeout: 6000
                });
            }
        });
    }
    $("#in-pic").on("change", () => {
        console.log("try load");
        let element = $(this)[0].activeElement;
        let that = $(this);
        let file = element.files[0];
        console.log(file);
        let formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("upload_file", "true");
        $.post({
            url: "/in-pic",
            success: (data) => {
                console.log(that.siblings(".in-pics"));
                $(".in-pics").append(data);
            },
            error: (err) => {
                console.log(err);
                alert(`error`);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 6000
        });
    });
});
//# sourceMappingURL=script.js.map