# NeighborhoodMap
这是前端开发高级课程的第三个项目：街区地图。项目计划使用gulp构建，使用npm管理需要的库，如jquery，knockout，bundle。bundle的作用是将多个的js文件合成到一个js文件中，减少浏览器请求次数，而且将所有变量和函数放在一个匿名函数中，不对全局环境造成污染。;)可以我使用的不熟练，在项目进行的过程中，暂停了该计划。现在，项目可以直接在`src`文档内运行，构建任务将放在项目审查通过后继续。

## 更新：第一次提交作业后的修改
1. 不适用jQuery获取DOM；
2. 更换Marker的Icon；
3. 地图载入错误处理；
4. 修改ajax错误处理；
## 如何运行项目
1. 项目暂时没有使用构建工具；
2. 在`src`文档下，双击index.html, 即可运行项目；
## 目前的项目内容说明
1. 依赖jquery库和knockout框架；
2. index.html和app.js是运行代码；
3. app.js分成三部分：硬编码的地址数组locations；MVVM模式的ViewModel；Google地图的initMap；
## License
[MIT](https://choosealicense.com/licenses/mit/)
