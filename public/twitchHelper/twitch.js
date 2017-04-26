var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var online = [];
var offline = [];
var defaultImgUrl = "http://placepu.gs/200/200";
var notFoundInfo = "Account Closed";
var showAllBtn, showOnlineBtn, showOfflineBtn, searchForm;

function getChannelInfo(channelName) {
  return $.getJSON('https://wind-bow.gomix.me/twitch-api/channels/' + channelName + "?callback=?");
}

function onRequestFail(jqXHR, textStatus, errorThrown) {
  console.log("There was an error with the request." + textStatus + errorThrown);
}

function onStreamCallback(data, index) {
  if(typeof(data) === "undefined") {
    console.log("Caught undefined data here");
  } else {
    if(data.stream === null) {
      var selector = '#item' + index;
      var listItem = $(selector);
      listItem.find('a').append("<i class='fa fa-ban fa-align-right fa-2x'></i>");
      offline.push(selector);
    } else if(data.stream === 'undefined') {
      // account cancelled
      listItem.find('.stream-info').html('Account closed');
    }
  }
}

function onChannelCallback(data, index) {
    var imgUrl = data.logo;
    if (!imgUrl) {
      imgUrl = defaultImgUrl;
    }
    var name = data.display_name;
    var url = data.url;
    var selector = '#item' + index;
    var listItem = $(selector);
    listItem.find('.profile-name').html(channels[index]);
    listItem.find('a').prop('href', url).attr('target', '_blank');
    listItem.find('img').prop('src', imgUrl);
    listItem.find('.profile-name').html(name);
    if(offline.indexOf(selector) < 0) {
        listItem.find('a').append("<i class='fa fa-check-circle-o fa-2x'></i>");
        online.push(selector);
        var extraInfo = data.status;
        if(extraInfo.length > 45) {
          extraInfo = extraInfo.substr(0, 45);
          extraInfo += " ...";
        }
        listItem.find('.stream-info').html(extraInfo);
    }
}

function retrieveStream(streamName) {
  return $.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + streamName + "?callback=?");
}

function onShowAllClicked() {
  $('.person-item').show();
}

function onShowOnlineClicked() {
  offline.forEach(function(element) {
    $(element).hide();
  });
  online.forEach(function(element) {
    $(element).show();
  });
}

function onShowOfflineClicked() {
  online.forEach(function(element) {
    $(element).hide();
  });
  offline.forEach(function(element) {
    $(element).show();
  });
}

function onSearchInputChange(event) {
  if (typeof(event) === "undefined")
    return;
  var searchValue = (event.target.value).toLowerCase();
  if (searchValue === "") {
    onShowAllClicked();
  } else {
    $('.person-item').each(function(index) {
      var profileName = $(this).find('.profile-name').text().toLowerCase();
      var indexOfEvent = profileName.indexOf(event);
      if (profileName.indexOf(searchValue) < 0)
        $(this).hide();
      else
        $(this).show();
    });
  }
}

function prepareUI() {
  showAllBtn = $('#show-all');
  showAllBtn.click(onShowAllClicked);
  showOnlineBtn = $('#show-online');
  showOnlineBtn.click(onShowOnlineClicked);
  showOfflineBtn = $('#show-offline');
  showOfflineBtn.click(onShowOfflineClicked);
  searchForm = $('#searchForm');
  searchForm.on('input', onSearchInputChange);
}

$(document).ready(function() {
  online = [];
  offline = [];
  prepareUI();
  // Retrieving info about list of usernames.
  channels.forEach(function(channelName, index) {
    retrieveStream(channelName)
      .done(function(data) { 
        onStreamCallback(data, index);
        getChannelInfo(channelName)
          .done(function(data) {
            onChannelCallback(data, index);
          })
          .fail(onRequestFail);
      })
      .fail(onRequestFail);
    
  });
});