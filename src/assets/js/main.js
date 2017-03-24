/**
 * Handles the functionality withing the main popup UI.
 */
// TODO: maybe add removeFromPinnedList to the events page instead?
(function ($) {
    var animeLink = $("#anime-link-image");
    var settingsBtn = $("#settingsWindowToggle");
    var lastWatched = $("#lastWatched");
    var lastWatchedDetails = $("#lastWatchedDetails");
    var pinnedListDiv = $("#pinnedList");

    // Click Handlers
    $(animeLink).on("click", function () {
        chrome.runtime.sendMessage({intent: "open_9anime"}, function (response) {
            console.log(response.result);
        });
    });

    $(settingsBtn).on("click", function () {
        chrome.runtime.openOptionsPage();
    });
    
    // This portion deals with binding the pinned anime list
    // onto the popup.
    // TODO: maybe this can be broken down to smaller functions?
    chrome.storage.local.get({pinnedList: []}, function (values) {
        var pinned = values["pinnedList"];
        if (pinned.length > 0) {

            console.log(pinned);
            for (var i = 0; i < pinned.length; i++) {
                $(pinnedListDiv).append(`<div data-url="${pinned[i].url}" class="pinned_item"><div class="anime_item">${pinned[i].name}</div><div class="pinned_delete"><img src="../../assets/images/delete.png"></div></div>`);
            }

            $(".pinned_item .anime_item").on("click", function () {

                var url = $(this).parent().data("url");
                chrome.runtime.sendMessage({intent: "open_anime", anime_url: url}, function (response) {
                    console.log(response.result);
                });
            });

            $(".pinned_item .pinned_delete").on("click", function () {

                var that = this;
                var url = $(this).parent().data("url");
                var requestObj = {
                    intent: "removePinnedAnime",
                    animeUrl: url
                };

                chrome.runtime.sendMessage(requestObj, function (response) {
                    // console.log(response.result, response.itemCount);
                    if (response.result === "success") {
                        $(that).parent().addClass("deleting_exit");
                        setTimeout(function () {
                            $(that).parent().remove();
                        }, 500);
                    }
                    if (response.itemCount === 0) {
                        $(pinnedListDiv).css({background: 'url("../../assets/images/no_item_banner.png")'});
                    }
                });

            });

        } else {
            console.log("Wew no anime!");
            $(pinnedListDiv).css({background: 'url("../../assets/images/no_item_banner.png")'});
        }

    })

})(jQuery);