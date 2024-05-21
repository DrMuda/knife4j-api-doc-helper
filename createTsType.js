// ==UserScript==
// @name         Knife4j-v4.5.0接口文档生成参数TS类型
// @namespace    http://tampermonkey.net/
// @version      2024-05-20
// @description  try to take over the world!
// @author       You
// @match        https://e-commerce.xiaofeilun.cn/e-commerce-api/doc.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaofeilun.cn
// @grant        none
// ==/UserScript==
let message = null;
const waitime = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
async function run() {
  const setBtnSuccess = await setMyDom();
  if (!setBtnSuccess) return;
}
async function setMyDom() {
  // 获取新增Dom的指定位置
  let loopCount = 0;
  let targetDom = null;
  while (loopCount <= 60) {
    targetDom = document.getElementsByClassName("api-title")?.[0];
    if (targetDom) break;
    loopCount++;
    await waitime(1000);
  }
  if (!targetDom) {
    message.warn("没找到api-title");
    return false;
  }
  // 设置容器
  const contain = document.createElement("div");
  const refreshBtn = document.createElement("button");
  contain.setAttribute("style", "display: flex;");
  refreshBtn.innerText = "刷新";
  targetDom.parentElement.insertBefore(refreshBtn, targetDom);
  targetDom.parentElement.insertBefore(contain, targetDom);
  const setTsTypeContent = () => {
    const requestType = createTsTypeByTarget("请求参数", {
      fieldName: 0,
      annotation: 1,
      type: 4,
      schema: 5,
    });
    const responeType = createTsTypeByTarget("响应参数", {
      fieldName: 0,
      annotation: 1,
      type: 2,
      schema: 3,
    });
    const requestTypeContain = document.createElement("div");
    const responeTypeContain = document.createElement("div");
    const copyRequestTypeBtn = document.createElement("button");
    const copyResponeTypeBtn = document.createElement("button");
    copyRequestTypeBtn.innerText = "复制请求参数";
    copyResponeTypeBtn.innerText = "复制响应参数";
    const requestTypeContent = document.createElement("code");
    const responeTypeContent = document.createElement("code");
    requestTypeContent.innerText = requestType || "";
    responeTypeContent.innerText = responeType || "";
    contain.appendChild(requestTypeContain);
    contain.appendChild(responeTypeContain);
    requestTypeContain.appendChild(copyRequestTypeBtn);
    requestTypeContain.appendChild(requestTypeContent);
    responeTypeContain.appendChild(copyResponeTypeBtn);
    responeTypeContain.appendChild(responeTypeContent);
    const btnStyle = "display: block";
    const typeContainStyle = [
      "flex: 1",
      "display: block",
      "overflow: scroll",
      "max-height: 500px",
      "white-space: pre",
      "border: 1px solid #dfdfdf",
      "border-radius: 8px",
      "padding: 8px",
    ].join(";");
    copyRequestTypeBtn.setAttribute("style", btnStyle);
    copyResponeTypeBtn.setAttribute("style", btnStyle);
    requestTypeContain.setAttribute("style", typeContainStyle);
    responeTypeContain.setAttribute("style", typeContainStyle);
    copyRequestTypeBtn.onclick = () => {
      window.navigator.clipboard.writeText(requestType || "");
      message.success("复制请求参数成功");
    };
    copyResponeTypeBtn.onclick = () => {
      window.navigator.clipboard.writeText(responeType || "");
      message.success("复制响应参数成功");
    };
  };
  const refresh = () => {
    contain.innerHTML = "";
    setTsTypeContent();
  };
  refreshBtn.onclick = refresh;
  for (let i = 0; i < 3; i++) {
    refresh();
    await waitime(1000);
  }
  return true;
}
// 根据类型创建tsType
function createTsTypeByTarget(targetInnertext, colNumConfig) {
  const titleDomList = Array.from(document.getElementsByClassName("api-title"));
  const requestParamsTitleIndex = titleDomList.findIndex(
    (dom) => dom.innerText === targetInnertext
  );
  const targetTitleDom = titleDomList[requestParamsTitleIndex];
  const targetDomChildren = Array.from(targetTitleDom.parentElement.children);
  const tableIdex =
    targetDomChildren.findIndex((dom) => dom === targetTitleDom) + 1;
  const table = Array.from(targetTitleDom.parentElement.children)[tableIdex];
  if (!table?.className.includes("ant-table-wrapper")) {
    message.warn("没找到ant-table-wrapper");
    return;
  }
  const trList = table
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");
  const tree = createTrTree(Array.from(trList));
  const tsType = createTsTypeFromTrTree(tree || [], colNumConfig);
  return tsType;
}
// 将嵌套表格转成树形结构
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
// 从树形tr创建tsType字符串
function createTsTypeFromTrTree(
  trTree,
  /** 各数据在哪一列 */
  colNumConfig,
  level = 1
) {
  let tsTypeStr = "{\n";
  // 缩进
  const indent = new Array(level * 2).fill(" ").join("");
  for (const { ele, children = [] } of trTree) {
    const tdList = Array.from(ele.getElementsByTagName("td"));
    const fieldName = tdList[colNumConfig.fieldName].innerText;
    const annotation = tdList[colNumConfig.annotation].innerText;
    const type = tdList[colNumConfig.type].innerText;
    const schema = tdList[colNumConfig.schema].innerText;
    tsTypeStr += `${indent}/** ${annotation} */\n`;
    if (fieldName === "userList") {
      console.log(children, trTree);
    }
    if (children.length > 0) {
      const childType = createTsTypeFromTrTree(
        children,
        colNumConfig,
        level + 1
      );
      if (type === "array") {
        tsTypeStr += `${indent}${fieldName}: ${childType}[]\n`;
      } else {
        tsTypeStr += `${indent}${fieldName}: ${childType}\n`;
      }
    } else {
      if (type === "array" && schema) {
        const tsType = javaTypeToTsType(schema);
        tsTypeStr += `${indent}${fieldName}: ${tsType}[]\n`;
      } else {
        const tsType = javaTypeToTsType(type);
        tsTypeStr += `${indent}${fieldName}: ${tsType}\n`;
      }
    }
  }
  tsTypeStr += `${indent.slice(0, indent.length - 2)}}`;
  return tsTypeStr;
}
// 获取表格行的嵌套级别
function getTrLevel(tr) {
  const levelMatch = tr.className.match(/ant-table-row-level-\d/);
  const level = Number(levelMatch[0].replace("ant-table-row-level-", ""));
  return level;
}
// 将java的类型转为ts的基础类型
function javaTypeToTsType(javaType) {
  if (javaType === "string") return "string";
  if (javaType.includes("integer")) return "number";
  if (javaType === "boolean") return "boolean";
  if (javaType === "file") return "File";
  return "unknownType";
}
// message弹窗
function createMessage() {
  const messageContain = document.createElement("div");
  messageContain.setAttribute(
    "style",
    `position: absolute;
    width: fit-content;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 9999`
  );
  document.body.appendChild(messageContain);
  function show(type, content) {
    const colorMap = {
      success: "#52c41a",
      error: "#f5222d",
      info: "#434343",
      warn: "#fa8c16",
    };
    const contentDiv = document.createElement("div");
    contentDiv.innerText = content;
    const contentBaseStyle = `color: ${colorMap[type]};
    padding: 0px 8px;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 0px 10px #dfdfdf;
    margin-bottom: 8px;
    height: 30px;
    line-height: 30px;
    transition: all 500ms;`;
    const contentStartStyle = `margin-top: -${30 + 8}px; opacity: 0;`;
    const contentEndStyle = `margin-top: 0px; opacity: 1;`;
    contentDiv.setAttribute("style", `${contentBaseStyle}${contentStartStyle}`);
    messageContain.appendChild(contentDiv);
    setTimeout(() => {
      contentDiv.setAttribute("style", `${contentBaseStyle}${contentEndStyle}`);
    }, 10);
    setTimeout(() => {
      contentDiv.setAttribute(
        "style",
        `${contentBaseStyle}${contentStartStyle}`
      );
      setTimeout(() => {
        contentDiv.remove();
      }, 500);
    }, 2500);
  }
  return {
    success: (content) => show("success", content),
    error: (content) => show("error", content),
    info: (content) => show("info", content),
    warn: (content) => show("warn", content),
  };
}
(function () {
  "use strict";
  // Your code here...
  if (window) {
    run();
    message = createMessage();
  }
})();
