# knife4j-api-doc-helper

## 简介

增强 knife4j-v4.5.0 接口文档页面

1. 在 knife4j-v4.5.0 的接口文档页面生成请求参数与响应参数的 TS 类型
2. 增加菜单筛选栏
3. 自动滚动选中的菜单项到视图中间
4. 接口路径前缀替换与点击复制
5. 同步多个标签页打开的接口， 点击顶部同步按钮开始同步
6. 刷新恢复已打开的tab

## 目的

1. knife4j 自己生成的类型谈不上好用， 有些类型有误， 而且不符合我的使用风格， 故通过`篡改猴`插件执行该脚本，往页面注入一些元素， 方便生成类型以供复制
2. 菜单栏顶部的筛选栏并不是筛选接口名的， 接口比较多时， 筛选功能的作用不言而喻
3. 接口通常以模块分组， 后端写完接口可能只发送该模块的其中一个接口链接， 然而文档不会自动滚动菜单栏， 有时候就需要自己找这个接口所在的模块， 有点麻烦， 所以加一个自动滚动
   - 吐槽：旧版本的甚至连展开模块的功能都没有， 只能看链接找当前模块是啥
4. 接口路径的前缀通过代理让路径简短了一点， 这样方便复制， 并且点击路径就可以直接复制下来
5. 当后端写完一个需求的接口， 大多时候都是有好几个接口。 当后端在飞书或其他办公应用发这几个接口的链接过来， 再逐个打开， 这时候每个接口都在一个页面中， 个人感觉查看起来很不方便； 所以通过localStorage同步不同页面打开的接口到一个页面里

注意： 生成的 TS 类型有强烈个人风格(单行注释，不换行，2 缩进)， 风格如：

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

### 二次开发
可以直接改 main.js， 也可以选择改 main.ts ~~(typescript 是世界上最好的语言)~~， 然后用 `tsc` 命令编译为 main.js
