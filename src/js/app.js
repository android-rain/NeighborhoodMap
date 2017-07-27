(function () {
    'use strict';

    // Filter, Sidebar
     var initialText = [
        {hello:"Hello Browserify"},
        {hello:"Hello Fast"},
        {hello:"Hello Boundle"},
        {hello:"Hello API"},
    ];
    var Text = function(data) {
        this.hello = ko.observable(data.hello);
    };
    var ViewModel = function() {
        var self = this;
        this.textList = ko.observableArray([]);
        initialText.forEach(function(textItem) {
            self.textList.push(new Text(textItem));
            console.log("add a list");
        });

        this.currentText = ko.observable(this.textList()[0]);
        var count=0;
        this.changeText = function() {
            count++;
            self.currentText(self.textList()[Math.round(count%4)]);
        };
    };
    ko.applyBindings(new ViewModel());

    // Google Map View

    window.initMap = function() {
        // 创建一个坐标
        var duanQiao = {lat: 30.25929, lng: 120.151935};
        // 创建地图对象，指定显示地图的DOM元素
        var map = new google.maps.Map(document.getElementById('map'), {
            center: duanQiao,
            zoom: 14,
            scroll: false,
        });

        // 创建一个marker对象
        var marker = new google.maps.Marker({
            position: duanQiao,
            map: map
        });

        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var markers = locations.map(function(location, i) {
            return new google.maps.Marker({
                position: location,
                map: map,
                label: labels[i % labels.length]
            });
        });
    }
    var locations = [
            {lat:30.238863, lng: 120.145283},
            {lat:30.231596, lng: 120.14966},
            {lat:30.230928, lng: 120.136936},
            {lat:30.246964, lng: 120.132676},
            {lat:30.252135, lng: 120.14613},
            {lat:30.254327, lng: 120.160695},
            {lat:30.239331, lng: 120.157739}
        ];
})();
