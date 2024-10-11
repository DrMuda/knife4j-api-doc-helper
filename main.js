// ==UserScript==
// @name         Knife4j-v4.5.0接口文档功能增强
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description 1. 在 knife4j-v4.5.0 的接口文档页面生成请求参数与响应参数的 TS 类型 2. 增加菜单筛选栏 3. 自动滚动选中的菜单项到视图中间 4. 接口路径前缀替换与点击复制 5. 同步多个标签页打开的接口， 点击顶部同步按钮开始同步
// @author       DrMuda
// @match        http://*/doc.html
// @match        https://*/doc.html
// @match        http://*/*/doc.html
// @match        https://*/*/doc.html
// @license MIT
// @resource css https://unpkg.com/layui@2.9.10/dist/css/layui.css
// @grant    GM_getResourceURL
// @grant    GM_getResourceText
// @grant    GM_addStyle
// ==/UserScript==
// @ts-ignore
GM_addStyle(GM_getResourceText("css"));
// #region autologjs
const cssStr = `#autolog{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;pointer-events:none;width:100vw;height:100vh;position:fixed;left:0;top:0;z-index:9999999;cursor:pointer;transition:0.2s}#autolog span{pointer-events:auto;width:max-content;animation:fadein 0.4s;animation-delay:0s;border-radius:6px;padding:10px 20px;box-shadow:0 0 10px 6px rgba(0,0,0,0.1);margin:4px;transition:0.2s;z-index:9999999;font-size:14px;display:flex;align-items:center;justify-content:center;gap:4px;height:max-content}#autolog span.hide{opacity:0;pointer-events:none;transform:translateY(-10px);height:0;padding:0;margin:0}.autolog-warn{background-color:#fffaec;color:#e29505}.autolog-error{background-color:#fde7e7;color:#d93025}.autolog-info{background-color:#e6f7ff;color:#0e6eb8}.autolog-success{background-color:#e9f7e7;color:#1a9e2c}.autolog-{background-color:#fafafa;color:#333}@keyframes fadein{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:translateY(0)}}`;
const svgIcons = {
  warn: `<svg t="1713405237257" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2387" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path d="M934.4 770.133333L605.866667 181.333333C586.666667 147.2 550.4 128 512 128c-38.4 0-74.666667 21.333333-93.866667 53.333333L89.6 770.133333c-19.2 34.133333-19.2 76.8 0 110.933334S145.066667 938.666667 183.466667 938.666667h657.066666c38.4 0 74.666667-21.333333 93.866667-57.6 19.2-34.133333 19.2-76.8 0-110.933334z m-55.466667 81.066667c-8.533333 14.933333-23.466667 23.466667-38.4 23.466667H183.466667c-14.933333 0-29.866667-8.533333-38.4-23.466667-8.533333-14.933333-8.533333-34.133333 0-49.066667L473.6 213.333333c8.533333-12.8 23.466667-21.333333 38.4-21.333333s29.866667 8.533333 38.4 21.333333l328.533333 588.8c8.533333 14.933333 8.533333 32 0 49.066667z" fill="#e29505" p-id="2388"></path><path d="M512 746.666667m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z" fill="#e29505" p-id="2389"></path><path d="M512 629.333333c17.066667 0 32-14.933333 32-32v-192c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v192c0 17.066667 14.933333 32 32 32z" fill="#e29505" p-id="2390"></path></svg>`,
  error: `<svg t="1713405212725" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1744" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#d93025" p-id="1745"></path><path d="M657.066667 360.533333c-12.8-12.8-32-12.8-44.8 0l-102.4 102.4-102.4-102.4c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l102.4 102.4-102.4 102.4c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533334s17.066667-2.133333 23.466667-8.533334l102.4-102.4 102.4 102.4c6.4 6.4 14.933333 8.533333 23.466667 8.533334s17.066667-2.133333 23.466666-8.533334c12.8-12.8 12.8-32 0-44.8l-106.666666-100.266666 102.4-102.4c12.8-12.8 12.8-34.133333 0-46.933334z" fill="#d93025" p-id="1746"></path></svg>`,
  info: `<svg t="1713405208589" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1582" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path d="M853.333333 138.666667H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666666v512c0 40.533333 34.133333 74.666667 74.666667 74.666667h151.466666V917.333333c0 12.8 8.533333 25.6 19.2 29.866667 4.266667 2.133333 8.533333 2.133333 12.8 2.133333 8.533333 0 17.066667-4.266667 23.466667-10.666666l136.533333-138.666667H853.333333c40.533333 0 74.666667-34.133333 74.666667-74.666667V213.333333c0-40.533333-34.133333-74.666667-74.666667-74.666666z m10.666667 586.666666c0 6.4-4.266667 10.666667-10.666667 10.666667H501.333333c-8.533333 0-17.066667 4.266667-23.466666 10.666667l-89.6 93.866666V768c0-17.066667-14.933333-32-32-32H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V213.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h682.666666c6.4 0 10.666667 4.266667 10.666667 10.666666v512z" fill="#0e6eb8" p-id="1583"></path><path d="M512 490.666667H298.666667c-17.066667 0-32 14.933333-32 32S281.6 554.666667 298.666667 554.666667h213.333333c17.066667 0 32-14.933333 32-32S529.066667 490.666667 512 490.666667zM672 341.333333H298.666667c-17.066667 0-32 14.933333-32 32S281.6 405.333333 298.666667 405.333333h373.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z" fill="#0e6eb8" p-id="1584"></path></svg>`,
  success: `<svg t="1713405224326" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2225" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#1a9e2c" p-id="2226"></path><path d="M701.866667 381.866667L448 637.866667 322.133333 512c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l149.333334 149.333333c6.4 6.4 14.933333 8.533333 23.466666 8.533334s17.066667-2.133333 23.466667-8.533334l277.333333-277.333333c12.8-12.8 12.8-32 0-44.8-14.933333-12.8-36.266667-12.8-49.066666-2.133333z" fill="#1a9e2c" p-id="2227"></path></svg>`,
};
const log = (type, text, time) => {
  let mainEl = getMainElement();
  let el = document.createElement("span");
  el.className = `autolog-${type}`;
  el.innerHTML = svgIcons[type] + text;
  mainEl.appendChild(el);
  setTimeout(() => {
    el.classList.add("hide");
  }, time - 500);
  setTimeout(() => {
    mainEl.removeChild(el);
    el = null;
  }, time);
};
const message = {
  default(text, time = 2500) {
    log("", text, time);
  },
  success(text, time = 2500) {
    log("success", text, time);
  },
  warn(text, time = 2500) {
    log("warn", text, time);
  },
  error(text, time = 2500) {
    log("error", text, time);
  },
  info(text, time = 2500) {
    log("info", text, time);
  },
};
function getMainElement() {
  let mainEl = document.querySelector("#autolog");
  if (!mainEl) {
    mainEl = document.createElement("div");
    mainEl.id = "autolog";
    document.body.appendChild(mainEl);
    let style = document.createElement("style");
    style.innerHTML = cssStr;
    document.head.insertBefore(style, document.head.firstChild);
  }
  return mainEl;
}
// #endregion
// #region 常量
/** 元素组件的id */
const componentId = {
  tsTypeContain: "tsTypeContain",
  requestTypeContain: "requestTypeContain",
  responseTypeContain: "responseTypeContain",
  copyRequestTypeBtn: "copyRequestTypeBtn",
  copyResponseTypeBtn: "copyResponseTypeBtn",
  requestTypeContent: "requestTypeContent",
  responseTypeContent: "responseTypeContent",
  requestCommentSwitch: "requestCommentSwitch",
  responseCommentSwitch: "responseCommentSwitch",
};
/** 缩进空格数量 */
const indentSpaces = 2;
const themeColors = {
  /** 关键字 蓝色 */
  keyword: "#0000FF",
  /** 类型名 蓝绿 */
  typeName: "#267f99",
  /** 注释 绿色 */
  comment: "#008000",
  /** 属性名 红色 */
  property: "#a60909",
  /** 原始TS类型 蓝色 */
  primitiveType: "#0000FF",
};
const storageKey = {
  currentPageOpenApiTabMap: "currentPageOpenApiTabMap",
  requestSyncPageKey: "requestSyncPageKey",
  responseSync: "responseSync",
};
const heartbeatTimeout = 1500;
// #endregion
// #region html模板与样式
const originTsTypeHtmlStr = `
<div class="${componentId.tsTypeContain} ts-type-contain">
  <div class="${componentId.requestTypeContain}">
    <div class="ts-type-bar layui-form">
      <button class="${componentId.copyRequestTypeBtn} copy-type-btn">
        复制请求参数
      </button>
      <input
        type="checkbox"
        name="requestCommentSwitch"
        title="显示注释|隐藏注释"
        lay-skin="switch"
        lay-filter="${componentId.requestCommentSwitch}"
        checked
      />
    </div>
    <pre
      class="type-content"
      contenteditable
    ><code class="${componentId.requestTypeContent}"></code></pre>
  </div>
  <div class="${componentId.responseTypeContain}">
    <div class="ts-type-bar layui-form">
      <button class="${componentId.copyResponseTypeBtn} copy-type-btn">
        复制响应参数
      </button>
      <input
        type="checkbox"
        name="responseCommentRadio"
        title="显示注释|隐藏注释"
        lay-skin="switch"
        lay-filter="${componentId.responseCommentSwitch}"
        checked
      />
    </div>
    <pre
      class="type-content"
      contenteditable
    ><code class="${componentId.responseTypeContent}"></code></pre>
  </div>
</div>`;
const originTsTypeCssStr = `
.ts-type-contain {
  display: flex;
}
.ts-type-contain > div {
  flex: 1;
}
.copy-type-btn {
  background: #1890ff;
  color: white;
  border-radius: 4px;
  border: none;
  margin: 4px 0;
  padding: 4px 8px;
  cursor: pointer;
}
.type-content {
  font-size: 12px;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  padding: 4px;
  overflow: auto;
  height: calc(100% - 30px);
  max-height: 500px;
  color: black;
  outline: none;
}
.method {
  padding: 4px;
  border-radius: 4px;
  color: white;
  background-color: #858585;
  font-weight: bold;
}
.method-get {
  background-color: #52a7f9;
}
.method-post {
  background-color: #46c588;
}

.ts-type-bar {
  display: flex;
  align-items: center;
  gap: 4px;
}
.ts-type-bar .layui-form-switch {
  margin-top: 0px;
}

.keyword {
  color: ${themeColors.keyword};
}
.typeName {
  color: ${themeColors.typeName};
}
.comment {
  color: ${themeColors.comment};
  overflow-wrap: anywhere;
}
.property {
  color: ${themeColors.property};
}
.primitiveType {
  color: ${themeColors.primitiveType};
}
`;
const waitTime = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
/** 生成ts类型 */
async function generateTsType(activeTabPanel) {
  const style = document.createElement("style");
  style.innerHTML = originTsTypeCssStr;
  document.body.appendChild(style);
  setMyDom(activeTabPanel);
}
/** 等待元素加载完成并返回， 没有则返回null */
async function waitElement(
  selector,
  /** 超时时间 X秒 */
  timeout,
  /** 检测频率 X秒/次 */
  frequency,
  parentElement
) {
  let targetElementList = null;
  let count = 0;
  for (let i = 0; i < timeout / frequency; i++) {
    if (count * frequency > timeout) break;
    targetElementList = parentElement
      ? Array.from(parentElement.querySelectorAll(selector))
      : Array.from(document.querySelectorAll(selector));
    if (targetElementList && targetElementList.length > 0) {
      return targetElementList;
    }
    await waitTime(1000 * frequency);
  }
  return null;
}
/** 创建一个防抖函数 */
function debounce(callback, wait) {
  let timer = null;
  return (...args) => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => callback(...args), wait);
  };
}
/** 设置复制按钮、文本框 等等dom */
async function setMyDom(parentDom) {
  // 获取新增Dom的指定位置
  const targetDom = (
    await waitElement(".knife4j-api-title", 10, 0.5, parentDom)
  )?.[0];
  if (!targetDom) {
    message.warn("没找到knife4j-api-title");
    return false;
  }
  const tabId = Date.now();
  const requestCommentSwitchId = `${tabId}_${componentId.requestCommentSwitch}`;
  const responseCommentSwitchId = `${tabId}_${componentId.responseCommentSwitch}`;
  const tsTypeHtmlStr = originTsTypeHtmlStr
    .replace(
      `lay-filter="${componentId.requestCommentSwitch}"`,
      `lay-filter="${requestCommentSwitchId}"`
    )
    .replace(
      `lay-filter="${componentId.responseCommentSwitch}"`,
      `lay-filter="${responseCommentSwitchId}"`
    );
  const titleContain = targetDom.parentElement;
  const documentDom = targetDom.parentElement.parentElement;
  if (!documentDom) {
    message.error("没找到 document 容器");
    return;
  }
  const exitsTsTypeContain = parentDom.getElementsByClassName(
    componentId.tsTypeContain
  )?.[0];
  if (exitsTsTypeContain) {
    exitsTsTypeContain.parentElement.innerHTML = tsTypeHtmlStr;
  } else {
    const div = document.createElement("div");
    div.innerHTML = tsTypeHtmlStr;
    documentDom.insertBefore(div, titleContain.nextSibling);
  }
  // @ts-ignore
  layui.form.render();
  const id = componentId;
  const copyRequestTypeBtn = parentDom.getElementsByClassName(
    id.copyRequestTypeBtn
  )?.[0];
  const copyResponseTypeBtn = parentDom.getElementsByClassName(
    id.copyResponseTypeBtn
  )?.[0];
  const requestTypeContent = parentDom.getElementsByClassName(
    id.requestTypeContent
  )?.[0];
  const responseTypeContent = parentDom.getElementsByClassName(
    id.responseTypeContent
  )?.[0];
  let requestTypeTable = getTableDom("request", documentDom);
  let responseTypeTable = getTableDom("response", documentDom);
  const setType = (
    type,
    /** 是否带上注释 */
    withComment
  ) => {
    const table = type === "request" ? requestTypeTable : responseTypeTable;
    const colNumConfig =
      type === "request"
        ? {
            fieldName: 0,
            annotation: 1,
            isRequired: 3,
            type: 4,
            schema: 5,
          }
        : {
            fieldName: 0,
            annotation: 1,
            isRequired: -1,
            type: 2,
            schema: 3,
          };
    const typeContent =
      type === "request" ? requestTypeContent : responseTypeContent;
    const copyTypeBtn =
      type === "request" ? copyRequestTypeBtn : copyResponseTypeBtn;
    const successMsg =
      type === "request" ? "复制请求参数成功" : "复制响应参数成功";
    const trList = table
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    const tree = createTrTree(Array.from(trList));
    let { tsTypeStr, tsTypeStrWithHighlight } = createTsTypeFromTrTree(
      tree || [],
      colNumConfig,
      withComment
    );
    typeContent.innerHTML = `<span class="keyword">interface</span> <span class="typeName">Data</span> ${tsTypeStrWithHighlight}`;
    copyTypeBtn.onclick = () => {
      window.navigator.clipboard.writeText(`interface Data ${tsTypeStr}` || "");
      message.success(successMsg);
    };
  };
  let prevRequestTypeTableInnerHtml = requestTypeTable.innerHTML;
  let prevResponseTypeTableInnerHtml = responseTypeTable.innerHTML;
  setType("request", true);
  setType("response", true);
  // 注册 注释开关事件
  // @ts-ignore
  layui.use(function () {
    // @ts-ignore
    const form = layui.form;
    form.on(`switch(${requestCommentSwitchId})`, function (data) {
      const checked = data?.elem?.checked;
      if (checked === true) {
        setType("request", true);
      }
      if (checked === false) {
        setType("request", false);
      }
    });
    form.on(`switch(${responseCommentSwitchId})`, function (data) {
      const checked = data?.elem?.checked;
      if (checked === true) {
        setType("response", true);
      }
      if (checked === false) {
        setType("response", false);
      }
    });
  });
  new Promise(async () => {
    // 有时候会因为网络或者其他问题， 表格数据没有加载完全， 获取到的类型全是 unknown， 在这里判断dom有无变化
    // 用MutationObserver监听不到， 不知为何
    for (let count = 0; count < 20; count++) {
      await waitTime(100);
      let newRequestTypeTable = getTableDom("request", documentDom);
      let newResponseTypeTable = getTableDom("response", documentDom);
      if (newRequestTypeTable.innerHTML !== prevRequestTypeTableInnerHtml) {
        requestTypeTable = newRequestTypeTable;
        setType("request", true);
      }
      if (newResponseTypeTable.innerHTML !== prevResponseTypeTableInnerHtml) {
        responseTypeTable = newResponseTypeTable;
        setType("response", true);
      }
    }
  });
  return true;
}
/** 获取请求参数或响应参数的 表格的dom */
function getTableDom(type, parentElement) {
  const targetInnerText = type === "request" ? "请求参数" : "响应参数";
  const titleDomList = Array.from(
    parentElement.getElementsByClassName("api-title")
  );
  const requestParamsTitleIndex = titleDomList.findIndex(
    (dom) => dom.innerText === targetInnerText
  );
  const targetTitleDom = titleDomList[requestParamsTitleIndex];
  const targetDomChildren = Array.from(targetTitleDom.parentElement.children);
  const tableIdex =
    targetDomChildren.findIndex((dom) => dom === targetTitleDom) + 1;
  const table = Array.from(targetTitleDom.parentElement.children)[tableIdex];
  if (!table?.className.includes("ant-table-wrapper")) {
    message.warn("没找到ant-table-wrapper");
    return null;
  }
  return table;
}
/** 将嵌套表格转成树形结构 */
function createTrTree(trList) {
  // 初始化栈
  const stack = [];
  // 初始化结果树
  const tree = [];
  for (const tr of trList) {
    // 当前处理的项
    const level = getTrLevel(tr);
    const currentItem = { ele: tr, level };
    // 如果栈为空，或者当前项的层级小于或等于栈顶项的层级
    // 则需要从栈中弹出元素直到栈为空或者栈顶项的层级小于当前项的层级
    while (stack.length && stack[stack.length - 1].level >= currentItem.level) {
      stack.pop();
    }
    // 如果栈为空，说明当前项是根节点之一，直接加入结果树
    if (stack.length === 0) {
      tree.push(currentItem);
    } else {
      // 否则，当前项是栈顶项的子节点，加入栈顶项的 children 数组
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(currentItem);
    }
    // 将当前项推入栈中
    stack.push(currentItem);
  }
  return tree;
}
/** 从树形tr创建tsType字符串 */
function createTsTypeFromTrTree(
  trTree,
  /** 各数据在哪一列 */
  colNumConfig,
  /** 是否生成注释 */
  withComment,
  level = 1
) {
  let tsTypeStr = "{\n";
  let tsTypeStrWithHighlight = "{\n";
  /** 缩进 */
  const indent = new Array(level * indentSpaces).fill(" ").join("");
  for (const { ele, children = [] } of trTree) {
    const tdList = Array.from(ele.getElementsByTagName("td"));
    const fieldName = tdList[colNumConfig.fieldName]?.innerText;
    const annotation = tdList[colNumConfig.annotation]?.innerText;
    const isRequired = tdList[colNumConfig.isRequired]?.innerText || "true";
    const type = tdList[colNumConfig.type]?.innerText;
    const schema = tdList[colNumConfig.schema]?.innerText;
    const requiredChar = isRequired === "false" ? "?" : "";
    const key = `${indent}${fieldName}${requiredChar}`;
    const highlightKey = `${indent}<span class="property" >${fieldName}</span>${requiredChar}`;
    // 注释
    if (withComment) {
      tsTypeStr += `${indent}/** ${annotation} */\n`;
      tsTypeStrWithHighlight += `${indent}<span class="comment" >/** ${annotation} */</span>\n`;
    }
    if (children.length > 0) {
      const child = createTsTypeFromTrTree(
        children,
        colNumConfig,
        withComment,
        level + 1
      );
      tsTypeStr += `${key}: ${child.tsTypeStr}`;
      tsTypeStrWithHighlight += `${highlightKey}: ${child.tsTypeStrWithHighlight}`;
      if (type === "array") {
        tsTypeStr += "[]\n";
        tsTypeStrWithHighlight += "[]\n";
      } else {
        tsTypeStr += "\n";
        tsTypeStrWithHighlight += "\n";
      }
    } else {
      if (type === "array" && schema) {
        const tsType = javaTypeToTsType(schema);
        tsTypeStr += `${key}: ${tsType}[]\n`;
        tsTypeStrWithHighlight += `${highlightKey}: <span class="primitiveType">${tsType}</span>[]\n`;
      } else {
        const tsType = javaTypeToTsType(type);
        tsTypeStr += `${key}: ${tsType}\n`;
        tsTypeStrWithHighlight += `${highlightKey}: <span class="primitiveType">${tsType}</span>\n`;
      }
    }
  }
  tsTypeStr += `${indent.slice(0, indent.length - 2)}}`;
  tsTypeStrWithHighlight += `${indent.slice(0, indent.length - 2)}}`;
  return { tsTypeStr, tsTypeStrWithHighlight };
}
/** 获取表格行的嵌套级别 */
function getTrLevel(tr) {
  const levelMatch = tr.className.match(/ant-table-row-level-\d/);
  const level = Number(levelMatch[0].replace("ant-table-row-level-", ""));
  return level;
}
/** 将java的类型转为ts的基础类型 */
function javaTypeToTsType(javaType) {
  if (javaType.includes("string")) return "string";
  if (javaType.includes("integer")) return "number";
  if (javaType.includes("boolean")) return "boolean";
  if (javaType.includes("file")) return "File";
  if (javaType.includes("number")) return "number";
  return "unknownType";
}
/** 让选中的菜单项滚动到视图中间 */
async function scrollSelectMenuIntoView() {
  const menu = (await waitElement(".knife4j-menu", 10, 0.5))?.[0];
  if (!menu) return;
  const selectItem = (
    await waitElement(".ant-menu-item-selected", 10, 0.5)
  )?.[0];
  if (selectItem) {
    setTimeout(() => {
      selectItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);
  }
}
/** 生成菜单搜索栏 */
async function generateMenuSearchBar(apiDocs) {
  const menu = (await waitElement(".knife4j-menu", 10, 0.5))?.[0];
  if (!menu) return;
  const form = document.createElement("div");
  form.className = "layui-form layui-row layui-col-space16";
  const select = document.createElement("select");
  select.setAttribute("lay-search", "");
  select.setAttribute("lay-filter", "handleSelect");
  form.appendChild(select);
  const paths = apiDocs.paths;
  const option = document.createElement("option");
  option.innerText = "请搜索";
  option.value = "请搜索";
  select.appendChild(option);
  Object.entries(paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(
      ([method, { tags, summary, deprecated }]) => {
        const option = document.createElement("option");
        let innerHTML = `<span class="method method-${method}">${method.toUpperCase()}</span> ${tags.join(
          " / "
        )} / ${summary}`;
        if (deprecated === true) {
          innerHTML = `<del>${innerHTML}</del>`;
        }
        option.innerHTML = innerHTML;
        option.value = [...tags, summary]
          .map((item) => encodeURIComponent(item))
          .join("/");
        select.appendChild(option);
      }
    );
  });
  menu.parentElement.insertBefore(form, menu);
  menu.setAttribute("style", "height: calc(100vh - 64px - 54px);");
  form.setAttribute("style", "margin: -15px -3px 0 8px");
  // @ts-ignore
  layui.form.render();
  // @ts-ignore
  layui.use(function () {
    // @ts-ignore
    const form = layui.form;
    // 监听 select 事件， 选中后找相应的一个菜单项进行 模拟点击
    form.on("select(handleSelect)", async function (data) {
      const value = data.value; // 获得被选中的值
      const paths = value.split("/").map((item) => decodeURIComponent(item));
      let parentDom = menu;
      for (const path of paths) {
        const liList = Array.from(parentDom.querySelectorAll(`ul>li`));
        const li = liList.find((li) => li.innerText.includes(path));
        if (!li) break;
        li?.getElementsByTagName("span")?.[0].click();
        await waitTime(100);
        parentDom = li;
      }
      scrollSelectMenuIntoView();
    });
  });
  // layui中如果 options 的内容不是纯文本， 会额外多出一些无效选项， 移除这个无效选项
  setTimeout(() => {
    Array.from(form.querySelectorAll(".layui-anim dd") || []).forEach((dd) => {
      const span = dd.getElementsByTagName("span")?.[0];
      if (span) return;
      dd.remove();
    });
  }, 100);
}
/** 拦截文档接口的数据 */
function interceptApiDocs() {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url;
    return originalOpen.apply(this, arguments);
  };
  return new Promise((resolve, reject) => {
    XMLHttpRequest.prototype.send = function () {
      this.addEventListener("load", function () {
        if (this._url.includes("v2/api-docs")) {
          // 拦截到的响应数据
          const response = this.responseText;
          try {
            resolve(JSON.parse(response));
          } catch (error) {
            reject();
            console.error(error);
          }
        }
      });
      return originalSend.apply(this, arguments);
    };
    setTimeout(reject, 30 * 1000);
  });
}
/** 替换原本的接口路径 */
async function replacePath(activeTabPanel) {
  const pathEl = await waitElement(
    ".knife4j-api-summary-path",
    10,
    0.5,
    activeTabPanel
  );
  if (!pathEl[0]) return;
  let path = pathEl[0].innerText;
  path = path.replace("/e-commerce-api/", "/api/");
  pathEl[0].innerText = path;
  pathEl[0].onclick = () => {
    navigator.clipboard.writeText(path);
    message.success("已复制");
  };
}
class OtherPagePathSynchronizer {
  static instance;
  key;
  constructor() {
    this.mount = this.mount.bind(this);
    this.syncOtherPage = this.syncOtherPage.bind(this);
    this.responseSync = this.responseSync.bind(this);
    this.key = Date.now();
    const key = sessionStorage.getItem("key");
    if (key) {
      this.key = Number(key);
    } else {
      this.key = Date.now();
      sessionStorage.setItem("key", this.key.toString());
    }
    window.addEventListener("storage", () => {
      this.responseSync();
    });
  }
  static getInstance() {
    if (OtherPagePathSynchronizer.instance) {
      return OtherPagePathSynchronizer.instance;
    }
    OtherPagePathSynchronizer.instance = new OtherPagePathSynchronizer();
    return OtherPagePathSynchronizer.instance;
  }
  mount() {
    const syncButton = document.createElement("span");
    syncButton.setAttribute(
      "style",
      "border:0; color: white; background: #1890ff; border-radius: 4px; cursor: pointer;padding: 2px 4px;"
    );
    syncButton.innerText = "同步其他页面";
    syncButton.onclick = this.syncOtherPage;
    document.querySelectorAll(".header")?.[0]?.appendChild(syncButton);
  }
  async syncOtherPage() {
    localStorage.setItem(storageKey.requestSyncPageKey, this.key.toString());
    await waitTime(500);
    localStorage.removeItem(storageKey.requestSyncPageKey);
    const length = localStorage.length;
    const pathList = [];
    for (let i = 0; i < length; i++) {
      const key = localStorage.key(i);
      if (key.includes(storageKey.responseSync)) {
        const value = JSON.parse(localStorage.getItem(key));
        pathList.push(...value);
        setTimeout(() => {
          localStorage.removeItem(key);
        }, 100);
      }
    }
    for (const path of pathList) {
      const currentPageOpenApiTabMap = JSON.parse(
        sessionStorage.getItem(storageKey.currentPageOpenApiTabMap)
      );
      if (Object.values(currentPageOpenApiTabMap).includes(path)) continue;
      location.href = path;
      await waitTime(500);
    }
    scrollSelectMenuIntoView();
    message.success("同步完成");
  }
  responseSync() {
    const key = localStorage.getItem(storageKey.requestSyncPageKey);
    if (!key) return;
    if (key === this.key.toString()) return;
    const currentPageOpenApiTabMap = JSON.parse(
      sessionStorage.getItem(storageKey.currentPageOpenApiTabMap)
    );
    localStorage.setItem(
      `${storageKey.responseSync}-${this.key}`,
      JSON.stringify(Object.values(currentPageOpenApiTabMap))
    );
  }
}
// 恢复曾经记录下来的接口， 一般是刷新页面时恢复
const restoreApiPath = async () => {
  try {
    const currentPageOpenApiTabMap = JSON.parse(
      sessionStorage.getItem(storageKey.currentPageOpenApiTabMap)
    );
    for (const path of Object.values(currentPageOpenApiTabMap)) {
      location.href = path;
      await waitTime(500);
    }
  } catch (error) {
    console.error(error);
  }
};
const onTabListChange = async () => {
  // 找到当前显示的tab
  const activeTabPanelList = await waitElement(
    ".knife4j-tab>.ant-tabs-content>div[aria-hidden=false]",
    10,
    0.5
  );
  if (!activeTabPanelList || activeTabPanelList.length <= 0) {
    message.error("没有找到激活中的tab");
    return;
  }
  generateTsType(activeTabPanelList[0]);
  replacePath(activeTabPanelList[0]);
  const tabSpanList = document.querySelectorAll(
    ".ant-tabs-top-bar .ant-tabs-tab span"
  );
  const activeTabSpan = document.querySelector(
    ".ant-tabs-top-bar .ant-tabs-tab-active span"
  );
  try {
    const apiTabMap = {
      [activeTabSpan.getAttribute("pagekey")]: location.href,
    };
    const currentPageOpenApiTabMapStr =
      sessionStorage.getItem(storageKey.currentPageOpenApiTabMap) || "{}";
    const currentPageOpenApiTabMap = JSON.parse(currentPageOpenApiTabMapStr);
    Array.from(tabSpanList).forEach((span) => {
      const pageKey = span.getAttribute("pagekey");
      if (pageKey === "kmain") return;
      const api = currentPageOpenApiTabMap[pageKey];
      if (api) {
        apiTabMap[pageKey] = api;
      }
    });
    sessionStorage.setItem(
      storageKey.currentPageOpenApiTabMap,
      JSON.stringify(apiTabMap)
    );
  } catch (error) {
    console.error(error);
  }
};
(function () {
  "use strict";
  if (window) {
    interceptApiDocs().then(
      async (apiDocs) => {
        const script = document.createElement("script");
        script.src = "//unpkg.com/layui@2.9.10/dist/layui.js";
        document.body.appendChild(script);
        const tabList = (
          await waitElement(".knife4j-tab>div[role=tablist]", 10, 0.5)
        )?.[0];
        if (!tabList) return;
        // 不好用， 先关掉吧
        // await restoreApiPath();
        OtherPagePathSynchronizer.getInstance().mount();
        scrollSelectMenuIntoView();
        generateMenuSearchBar(apiDocs);
        // 监听tab变化， 当打开一个新tab时， 会触发多次监听回调
        const observer = new MutationObserver(onTabListChange);
        const config = { childList: true, subtree: true };
        observer.observe(tabList, config);
      },
      () => {
        message.error("拦截接口数据失败");
      }
    );
  }
})();
