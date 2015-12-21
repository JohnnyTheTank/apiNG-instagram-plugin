"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-instagram-plugin
 @licence MIT
 */

jjtApingInstagram.service('apingInstagramHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
    this.getThisPlattformString = function () {
        return "instagram";
    };

    this.getThisPlattformLink = function () {
        return "https://instagram.com/";
    };

    this.replaceHashtagWithoutSpaces = function(_string) {
        if(_string && $.type(_string) === "string") {
            _string = _string.replace(/#/g, " #");
            _string = _string.replace(/  #/g, " #");
        }
        return _string;
    };

    this.getObjectByJsonData = function (_data, _helperObject) {
        var requestResults = [];
        if (_data) {
            var _this = this;
            if (_data.data) {
                angular.forEach(_data.data, function (value, key) {


                    var tempResult;
                    if(_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                        tempResult = _this.getNativeItemByJsonData(value, _helperObject.model);
                    } else {
                        tempResult = _this.getItemByJsonData(value, _helperObject.model);
                    }
                    if(tempResult) {
                        requestResults.push(tempResult);
                    }
                });
            }
        }
        return requestResults;
    };

    this.getItemByJsonData = function (_item, _model) {
        var returnObject = {};
        if (_item && _model) {
            switch (_model) {
                case "social":
                    returnObject = this.getSocialItemByJsonData(_item);
                    break;
                case "video":
                    returnObject = this.getVideoItemByJsonData(_item);
                    break;
                case "image":
                    returnObject = this.getImageItemByJsonData(_item);
                    break;
                default:
                    return false;
            }
        }
        return returnObject;
    };

    this.getSocialItemByJsonData = function (_item) {
        var socialObject = apingModels.getNew("social", this.getThisPlattformString());

        $.extend(true, socialObject, {
            blog_name: _item.user.full_name || "@" + _item.user.username,
            blog_id: "@" + _item.user.username,
            blog_link: this.getThisPlattformLink() + _item.user.username,
            intern_type: _item.type,
            timestamp: parseInt(_item.created_time) * 1000,
            post_url: _item.link,
            intern_id: _item.id,
            text: _item.caption ? _item.caption.text : undefined,
            likes: _item.likes ? _item.likes.count : undefined,
            comments: _item.comments ? _item.likes.comments : undefined,
        });

        socialObject.date_time = new Date(socialObject.timestamp);

        socialObject.text = this.replaceHashtagWithoutSpaces(socialObject.text);

        if (_item.type == "video") {
            socialObject.type = "video";
            socialObject.source = _item.videos;
        }

        socialObject.img_url = _item.images.standard_resolution.url;

        return socialObject;
    };

    this.getVideoItemByJsonData = function (_item) {

        if(_item.type != "video") {
            return false;
        }

        var videoObject = apingModels.getNew("video", this.getThisPlattformString());

        $.extend(true, videoObject, {
            blog_name: _item.user.full_name || "@" + _item.user.username,
            blog_id: "@" + _item.user.username,
            blog_link: this.getThisPlattformLink() + _item.user.username,
            intern_type: _item.type,
            timestamp: parseInt(_item.created_time) * 1000,
            post_url: _item.link,
            intern_id: _item.id,
            text: _item.caption ? _item.caption.text : undefined,
            likes: _item.likes ? _item.likes.count : undefined,
            comments: _item.comments ? _item.likes.comments : undefined,
            type: "video",
            source: _item.videos.standard_resolution ? _item.videos.standard_resolution.url : undefined,
        });

        videoObject.date_time = new Date(videoObject.timestamp);
        videoObject.text = this.replaceHashtagWithoutSpaces(videoObject.text);
        videoObject.img_url = _item.images.standard_resolution.url;
        return videoObject;
    };

    this.getImageItemByJsonData = function (_item) {
        if(_item.type != "image") {
            return false;
        }

        var imageObject = apingModels.getNew("image", this.getThisPlattformString());
        $.extend(true, imageObject, {
            blog_name: _item.user.full_name || "@" + _item.user.username,
            blog_id: "@" + _item.user.username,
            blog_link: this.getThisPlattformLink() + _item.user.username,
            intern_type: _item.type,
            timestamp: parseInt(_item.created_time) * 1000,
            post_url: _item.link,
            intern_id: _item.id,
            text: _item.caption ? _item.caption.text : undefined,
            likes: _item.likes ? _item.likes.count : undefined,
            comments: _item.comments ? _item.likes.comments : undefined,
            type: "image",
        });

        imageObject.date_time = new Date(imageObject.timestamp);
        imageObject.text = this.replaceHashtagWithoutSpaces(imageObject.text);
        imageObject.img_url = _item.images.standard_resolution.url;
        return imageObject;
    };

    this.getNativeItemByJsonData = function (_item, _model) {

        var nativeItem = {};

        switch (_model) {
            case "image":
                if(_item.type != "image") {
                    return false;
                } else {
                    nativeItem = _item;
                }
                break;

            case "video":
                if(_item.type != "video") {
                    return false;
                } else {
                    nativeItem = _item;
                }
                break;
        }

        nativeItem = _item;

        return nativeItem;
    };


}]);