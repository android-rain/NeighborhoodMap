(function() {
  'use strict';

  // Sidebar  *************START
  var locations = [{
      name: "断桥残雪",
      lat: 30.25929,
      lng: 120.151935,
      show: true,
    },
    {
      name: "平湖秋月",
      lat: 30.252135,
      lng: 120.14613,
      show: true,
    },
    {
      name: "曲院风荷",
      lat: 30.248646,
      lng: 120.131142,
      show: true,
    },
    {
      name: "苏堤春晓",
      lat: 30.246964,
      lng: 120.132676,
      show: true,
    },
    {
      name: "花港观鱼",
      lat: 30.230928,
      lng: 120.136936,
      show: true,
    },
    {
      name: "三潭印月",
      lat: 30.238863,
      lng: 120.145283,
      show: true,
    },
    {
      name: "雷峰塔",
      lat: 30.231596,
      lng: 120.14966,
      show: true,
    },
    {
      name: "柳浪闻莺",
      lat: 30.239331,
      lng: 120.157739,
      show: true,
    },
    {
      name: "音乐喷泉",
      lat: 30.254327,
      lng: 120.160695,
      show: false,
    },
  ];

  var Location = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.show = ko.observable(data.show);
  };
  var ViewModel = function() {
    var self = this;
    this.locationArray = ko.observableArray([]);
    locations.forEach(function(location) {
      self.locationArray.push(new Location(location));
    });


  // placeholder 更新
    this.searchLocation = ko.observable("");
    // 处理列表点击事件
    this.markThis = function(marker) {
      self.searchLocation(marker.name());
    };
    // 筛选列表
    // TODO：筛选的时候如何自动同步，现在需要submit（回车），用户体验不好
    this.filter = function() {
      // self.searchLocation();
      var text = self.searchLocation();

      self.locationArray().forEach(function(location) {
        if(location.name().includes(text)) {
          // TODO
          self.show(location);
        }
        else {
          self.hide(location);
        }
      });
    };

    this.show = function(marker) {
      marker.show(true);
    };

    this.hide = function(marker) {
      marker.show(false);
    };
  };
  ko.applyBindings(new ViewModel());
  // Sidebar  *************END

  // Google Map View

  // window.initMap = function() {
  //     // 创建一个坐标
  //     var duanQiao = {lat: 30.25929, lng: 120.151935};
  //     // 创建地图对象，指定显示地图的DOM元素
  //     var map = new google.maps.Map(document.getElementById('map'), {
  //         center: duanQiao,
  //         zoom: 14,
  //         scroll: false,
  //     });

  //     // 创建一个marker对象
  //     var marker = new google.maps.Marker({
  //         position: duanQiao,
  //         map: map
  //     });

  //     var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //     var markers = locations.map(function(location, i) {
  //         return new google.maps.Marker({
  //             position: location,
  //             map: map,
  //             label: labels[i % labels.length]
  //         });
  //     });
  // };
})();
