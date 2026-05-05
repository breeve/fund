1. 读取 tmp/docs 里面的文档,理解系统需求, 输出到 docs 目录下面
2. client端需要打包为 macos, ios, PWA; client 风格参考 disc/docs/ui1.png, disc/docs/ui2.png, disc/docs/ui3.png
3. server端使用python实现; 查询基金数据源使用开源库,不要重复造轮子
4. 数据库使用psql
5. 软件名: 天天开心
6. 使用 makefile 进行构建管理;先只提供
  .1 make start 一键后台提供所有服务,所有服务的日志默认输出在同一个日志文件里面去;
  .2 make stop 一键停止所有服务;
  .3 makefile 要考虑跨平台的问题, 需要在macos. linux 上都能进行开发
7. 先不要管打包的事情, 优先实现功能
