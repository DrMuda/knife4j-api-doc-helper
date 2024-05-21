# knife4j-api-doc-tstype

## 简介

在 knife4j-v4.5.0 的接口文档页面生成请求参数与响应参数的 TS 类型

main.ts 为主代码， main.js 由 main.ts 编译而来

## 目的

knife4j 自己生成的类型谈不上好用， 有些类型有误， 而且不符合我的使用风格， 故通过`篡改猴`插件执行该脚本，往页面注入一些元素， 方便生成类型以供使用

生成的 TS 类型有强烈个人风格(单行注释，不换行，2 缩进)， 风格如：

```typescript
interface Data {
  /** 注释 */
  a: number;
  /** 未识别的类型, 引起报错方便手动修正 */
  b: unknownType;
}
```

## 使用方法
该脚本依赖`篡改猴`插件运行，先安装好再继续。 插件链接：[edge 篡改猴](https://microsoftedge.microsoft.com/addons/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/iikmkjmpaadaobahmlepeloendndfphd?hl=zh-CN)，[chrome 篡改猴](https://chromewebstore.google.com/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-CN&utm_source=ext_sidebar)

### 添加脚本
首先将 `main.js`（注意是 <span style="color: red">js</span> 文件）全部复制

插件安装完毕后， 在浏览器右上角， 地址栏右边， 有一个插件图标， 点击即显示正在运行的插件。 点击篡改猴插件，再点击`添加新脚本`， 
然后删除全部已有的代码，再将刚才复制的代码粘贴在此处即可。

最后回到接口文档页面， 刷新， 如无意外即可看到注入的一些内容
