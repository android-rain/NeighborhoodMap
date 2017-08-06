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
            show: true,
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
        // TODO：筛选的时候如何自动同步，现在需要submit（回车），用户体验不好。
        this.filter = function() {
            // self.searchLocation();
            var text = self.searchLocation();

            self.locationArray().forEach(function(location, i) {
                if (location.name().includes(text)) {
                    // TODO
                    self.show(location);
                    locations[i].show = true;
                } else {
                    self.hide(location);
                    locations[i].show = false;
                }
            });
            self.test();
        };
        this.test = function() {
            locations.forEach(function(location) {
                console.log("ob: " + location.show);
            });
            self.locationArray().forEach(function(location) {
                console.log("ko: " + location.show());
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

    window.initMap = function() {
        // 创建一个坐标
        var duanQiao = { lat: 30.25929, lng: 120.151935 };
        // 创建地图对象，指定显示地图的DOM元素
        var map = new google.maps.Map(document.getElementById('map'), {
            center: duanQiao,
            zoom: 14,
            scroll: false,
        });

        // 创建一个marker对象
        // var marker = new google.maps.Marker({
        //     position: duanQiao,
        //     map: map
        // });

        // 显示所有markers
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var markers = locations.map(function(location, i) {
            return new google.maps.Marker({
                position: location,
                map: map,
                label: labels[i % labels.length],
                animation: google.maps.Animation.DROP,
                icon: defaultIcon
            });
        });
        // show infowindow
        var infowindow = new google.maps.InfoWindow();
        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('FFFF24');
        // TODO：google place api
        // var service = new google.maps.places.PlacesService();
        for (var i = 0; i < markers.length; i++) {
            markers[i].addListener('click', function() {
                // set icon
                // this.setIcon(highlightedIcon);
                var that = this;
                toggleBounce(that);
                // load weather
                var weatherRequestTimeout = setTimeout(function() {
                    console.log("Relevant Wikipedia Links Could not be loaded");
                }, 4000);
                $.ajax({
                    url: 'http://v.juhe.cn/weather/index',
                    data: { cityname: '杭州', format: "1", dtype: 'json', key: "e0f4519563af0c7d6da21b41f7132642" },
                    dataType: 'jsonp',
                    success: function(data) {
                        var sk = data.result.sk;
                        var temp = sk.temp;
                        var wind = sk.wind_strength;
                        var humidity = sk.humidity;
                        infowindow.setContent(`<div id="weather"><p>温度： ${temp}</p><p>风力： ${wind}</p><p>湿度：${humidity}</p></div>`);
                        // for (var ele of data[1]) {
                        //     console.log(ele);
                        // $wikiElem.append(`<li class="article"><a href="https://en.wikipedia.org/wiki/${ele}">${ele}</a></li>`);
                        clearTimeout(weatherRequestTimeout);
                    },
                })
                infowindow.open(map, this);
            });
        }
        // This function takes in a COLOR, and then creates a new marker
        // icon of that color. The icon will be 21 px wide by 34 high, have an origin
        // of 0, 0 and be anchored at 10, 34).
        function makeMarkerIcon(markerColor) {
            var markerImage = new google.maps.MarkerImage(
                'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
                '|40|_|%E2%80%A2',
                new google.maps.Size(21, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34),
                new google.maps.Size(21, 34));
            return markerImage;
        }

        function toggleBounce(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function(){marker.setAnimation(null);}, 2800);
            }
        }
        // **************************infowindow END**************************************

        //
        $("#search").submit(function() {
            locations.forEach(function(location, i) {
                console.log(location.show);
                if (!location.show) {
                    hideMaker(markers[i]);
                } else {
                    showMarker(markers[i]);
                }
            });
        });

        var hideMaker = function(marker) {
            marker.setMap(null);
        };
        var showMarker = function(marker) {
            marker.setMap(map);
        };
        var hideMakers = function(markers) {
            for (var i = 0; i < marker.length; i++) {
                marker[i].setMap(null);
            }
        };

        var showListings = function() {
            var bounds = new google.map.LatLngBounds();
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            map.fitBounds(bounds);
        };




    };
})();