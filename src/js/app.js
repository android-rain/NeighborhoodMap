(function() {
    'use strict';

    // Sidebar  *************START
    // 地址数组
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
    // 绑定地址所有属性
    var Location = function(data) {
        this.name = ko.observable(data.name);
        this.lat = ko.observable(data.lat);
        this.lng = ko.observable(data.lng);
        this.show = ko.observable(data.show);
    };
    var ViewModel = function() {
        var self = this;
        // 双向绑定所有地址
        this.locationArray = ko.observableArray([]);
        locations.forEach(function(location) {
            self.locationArray.push(new Location(location));
        });


        // 搜索框 placeholder 更新
        this.searchLocation = ko.observable("");
        // 处理列表点击事件
        this.markThis = function(marker) {

            self.searchLocation(marker.name());
            // 在手机上点击列表中的一个地点后，隐藏列表
            self.hideList();
        };
        // 筛选列表
        // TODO：搜索框输入文字的时候如何同步筛选列表项？现在需要submit（回车），用户体验不好。
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
            // self.test();
        };
        // 测试用
        this.test = function() {
            locations.forEach(function(location) {
                console.log("ob: " + location.show);
            });
            self.locationArray().forEach(function(location) {
                console.log("ko: " + location.show());
            });
        };
        // 显示列表项
        this.show = function(marker) {
            marker.show(true);
        };
        // 隐藏列表项
        this.hide = function(marker) {
            marker.show(false);
        };

        var sideStyle = $(".side");
        var mapStyle = $("#map");
        var headStyle = $("#head");
        // 显示搜索列表
        this.displayList = function() {
            sideStyle.css({
                "display": "block",
                "width": "50%",
            });
            mapStyle.css({
                "width": "45%"
            });
        };
        // 隐藏搜索列表
        this.hideList = function() {
            console.log(headStyle.css("display"));
            if (headStyle.css("display") === "block") {

                sideStyle.css({
                    "display": "none",
                    "width": "15%"
                });
                mapStyle.css({
                    "width": "100%"
                });
            }

        };
    };
    ko.applyBindings(new ViewModel());
    // Sidebar  *************END

    // Google Map View ************START
    window.initMap = function() {
        // 创建一个坐标
        var duanQiao = { lat: 30.25929, lng: 120.151935 };
        // 创建地图对象，指定显示地图的DOM元素
        var map = new google.maps.Map(document.getElementById('map'), {
            center: duanQiao,
            zoom: 14,
            scroll: false,
        });

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
        var infowindow = new google.maps.InfoWindow();
        // TODO：google place api
        // var service = new google.maps.places.PlacesService();
        for (var i = 0; i < markers.length; i++) {
            markers[i].addListener('click', function() {
                var that = this;
                toggleBounce(that);
                // load weather
                weather();
                infowindow.open(map, this);
            });
        }

        // 点击列表项，对应marker跳动并显示infowindow
        $("#markersList li").click(function() {
            var idx = $(this).index();
            toggleBounce(markers[idx]);
            weather();
            infowindow.open(map, markers[idx]);
        });

        // 使用聚合 api，获取天气数据
        // 注意：由于景点天气收费，暂时使用城市天气替代
        function weather() {
            var weatherRequestTimeout = setTimeout(function() {
                console.log("The Weather Could not be loaded");
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
            });
        }

        // marker 跳动函数
        function toggleBounce(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() { marker.setAnimation(null); }, 2800);
            }
        }
        // **************************infowindow END**************************************

        // 搜索栏提交搜索后，显示搜索结果中的markers
        $("#search").submit(function() {
            locations.forEach(function(location, i) {
                if (!location.show) {
                    hideMaker(markers[i]);
                } else {
                    showMarker(markers[i]);
                }
            });
        });
        // 隐藏marker
        var hideMaker = function(marker) {
            marker.setMap(null);
        };
        // 显示marker
        var showMarker = function(marker) {
            marker.setMap(map);
        };
        // TODO：点击列表项，地图上对应的marker居中
        var showListings = function() {
            var bounds = new google.map.LatLngBounds();
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            map.fitBounds(bounds);
        };

        // GOOGLE MAP **************END


    };
})();