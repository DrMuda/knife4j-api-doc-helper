// ==UserScript==
// @name         Knife4j-v4.5.0接口文档生成参数TS类型
// @namespace    http://tampermonkey.net/
// @version      2024-05-21
// @description  try to take over the world!
// @author       DrMuda
// @match        http://*/doc.html
// @match        https://*/doc.html
// @match        http://*/*/doc.html
// @match        https://*/*/doc.html
// @grant        none
// ==/UserScript==

/** 各字段位于哪列 */
interface ColNumConfig {
  fieldName: number;
  annotation: number;
  isRequired: number;
  type: number;
  schema: number;
}
interface TrTreeNode {
  ele: HTMLTableRowElement;
  children?: TrTreeNode[];
  level: number;
}

let message = null as unknown as ReturnType<typeof createMessage>;

const waitime = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

async function run() {
  const tabList = (
    await waitElement(".knife4j-tab>div[role=tablist]", 10, 0.5)
  )?.[0];
  if (!tabList) {
    message.error("没有找到对应内容");
    return;
  }

  const onTabListChange = debounce(async () => {
    // 找到当前显示的tab
    const activeTabanelList = await waitElement(
      ".knife4j-tab>.ant-tabs-content>div[aria-hidden=false]",
      10,
      0.5
    );

    if (!activeTabanelList || activeTabanelList.length <= 0) {
      message.error("没有找到激活中的tab");
      return;
    }
    setMyDom(activeTabanelList[0]);
  }, 200);

  // 监听tab变化， 当打开一个新tab时， 会触发多次监听回调
  const observer = new MutationObserver(onTabListChange);
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(tabList, config);
}

// 等待元素加载完成并返回， 没有则返回null
async function waitElement(
  selector: string,
  /** 超时时间 X秒 */
  timeout: number,
  /** 检测频率 X秒/次 */
  frequency: number,
  parentElement?: Element
) {
  let targetElementList: null | Element[] = null;
  let count = 0;
  for (let i = 0; i < timeout / frequency; i++) {
    if (count * frequency > timeout) break;
    targetElementList = parentElement
      ? Array.from(parentElement.querySelectorAll(selector))
      : Array.from(document.querySelectorAll(selector));
    if (targetElementList && targetElementList.length > 0) {
      return targetElementList;
    }
    await waitime(1000 * frequency);
  }
  return null;
}

// 防抖函数
function debounce<T>(callback: (...args: T[]) => void, wait: number) {
  let timer = null;
  return (...args: T[]) => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => callback(...args), wait);
  };
}

// 设置复制按钮、文本框 等等dom
async function setMyDom(parentDom: Element) {
  // 获取新增Dom的指定位置
  const targetDom = (
    await waitElement(".knife4j-api-title", 10, 0.5, parentDom)
  )?.[0];
  if (!targetDom) {
    message.warn("没找到knife4j-api-title");
    return false;
  }

  const titleContian = targetDom.parentElement;
  const documentDom = targetDom.parentElement.parentElement;
  if (!documentDom) {
    message.error("没找到 document 容器");
    return;
  }

  const containClass = "ts-type-contain";
  const refreshBtnClass = "refresh-btn";

  // 设置容器
  const contain =
    documentDom.querySelector(`.${containClass}`) ||
    document.createElement("div");
  const refreshBtn = (documentDom.querySelector(`.${refreshBtnClass}`) ||
    document.createElement("button")) as HTMLButtonElement;

  contain.className = containClass;
  refreshBtn.className = refreshBtnClass;

  contain.remove();
  refreshBtn.remove();

  contain.setAttribute("style", "display: flex;");
  refreshBtn.innerText = "刷新";
  documentDom.insertBefore(contain, titleContian.nextSibling);
  documentDom.insertBefore(refreshBtn, titleContian.nextSibling);

  const setTsTypeContent = () => {
    const requestType = createTsTypeByTarget(
      "请求参数",
      {
        fieldName: 0,
        annotation: 1,
        isRequired: 3,
        type: 4,
        schema: 5,
      },
      documentDom
    );
    const responeType = createTsTypeByTarget(
      "响应参数",
      {
        fieldName: 0,
        annotation: 1,
        isRequired: -1,
        type: 2,
        schema: 3,
      },
      documentDom
    );

    const requestTypeContainClass = "request-type-contain";
    const responeTypeContainClass = "respone-type-contain";
    const copyRequestTypeBtnClass = "copy-request-type-btn";
    const copyResponeTypeBtnClass = "copy-respone-type-btn";
    const requestTypeContentClass = "request-type-content";
    const responeTypeContentClass = "respone-type-content";

    const requestTypeContain =
      documentDom.querySelector(`.${requestTypeContainClass}`) ||
      document.createElement("div");

    const responeTypeContain =
      documentDom.querySelector(`.${responeTypeContainClass}`) ||
      document.createElement("div");

    const copyRequestTypeBtn = (documentDom.querySelector(
      `.${copyRequestTypeBtnClass}`
    ) || document.createElement("button")) as HTMLButtonElement;

    const copyResponeTypeBtn = (documentDom.querySelector(
      `.${copyResponeTypeBtnClass}`
    ) || document.createElement("button")) as HTMLButtonElement;

    const requestTypeContent = (documentDom.querySelector(
      `.${requestTypeContentClass}`
    ) || document.createElement("code")) as HTMLDivElement;

    const responeTypeContent = (documentDom.querySelector(
      `.${responeTypeContentClass}`
    ) || document.createElement("code")) as HTMLDivElement;

    requestTypeContain.className = requestTypeContainClass;
    responeTypeContain.className = responeTypeContainClass;
    copyRequestTypeBtn.className = copyRequestTypeBtnClass;
    copyResponeTypeBtn.className = copyResponeTypeBtnClass;
    requestTypeContent.className = requestTypeContentClass;
    responeTypeContent.className = responeTypeContentClass;

    copyRequestTypeBtn.innerText = "复制请求参数";
    copyResponeTypeBtn.innerText = "复制响应参数";
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
    await waitime(500);
  }

  return true;
}

// 根据类型创建tsType
function createTsTypeByTarget(
  targetInnertext: string,
  colNumConfig: ColNumConfig,
  parentElement: Element
) {
  const titleDomList = Array.from(
    parentElement.getElementsByClassName("api-title")
  ) as HTMLDivElement[];
  const requestParamsTitleIndex = titleDomList.findIndex(
    (dom) => dom.innerText === targetInnertext
  );
  const targetTitleDom = titleDomList[requestParamsTitleIndex];
  const targetDomChildren = Array.from(targetTitleDom.parentElement!.children);
  const tableIdex =
    targetDomChildren.findIndex((dom) => dom === targetTitleDom) + 1;
  const table = Array.from(targetTitleDom.parentElement!.children)[tableIdex];
  if (!table?.className.includes("ant-table-wrapper")) {
    message.warn("没找到ant-table-wrapper");
    return;
  }
  const trList = table
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");
  const tree = createTrTree(Array.from(trList));
  const tsType = createTsTypeFromTrTree(tree || [], colNumConfig);
  return `interface Data ${tsType}`;
}

// 将嵌套表格转成树形结构
function createTrTree(trList: HTMLTableRowElement[]) {
  // 初始化栈
  const stack: TrTreeNode[] = [];
  // 初始化结果树
  const tree: TrTreeNode[] = [];

  for (const tr of trList) {
    // 当前处理的项
    const level = getTrLevel(tr);
    const currentItem: TrTreeNode = { ele: tr, level };

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
  trTree: TrTreeNode[],
  /** 各数据在哪一列 */
  colNumConfig: ColNumConfig,
  level: number = 1
) {
  let tsTypeStr = "{\n";
  // 缩进
  const indent = new Array(level * 2).fill(" ").join("");
  for (const { ele, children = [] } of trTree) {
    const tdList = Array.from(ele.getElementsByTagName("td"));
    const fieldName = tdList[colNumConfig.fieldName]?.innerText;
    const annotation = tdList[colNumConfig.annotation]?.innerText;
    const isRequired = tdList[colNumConfig.isRequired]?.innerText || "true";
    const type = tdList[colNumConfig.type]?.innerText;
    const schema = tdList[colNumConfig.schema]?.innerText;

    const requiredChar = isRequired === "false" ? "?" : "";
    const key = `${indent}${fieldName}${requiredChar}`;

    tsTypeStr += `${indent}/** ${annotation} */\n`;
    if (children.length > 0) {
      const childType = createTsTypeFromTrTree(
        children,
        colNumConfig,
        level + 1
      );
      if (type === "array") {
        tsTypeStr += `${key}: ${childType}[]\n`;
      } else {
        tsTypeStr += `${key}: ${childType}\n`;
      }
    } else {
      if (type === "array" && schema) {
        const tsType = javaTypeToTsType(schema);
        tsTypeStr += `${key}: ${tsType}[]\n`;
      } else {
        const tsType = javaTypeToTsType(type);
        tsTypeStr += `${key}: ${tsType}\n`;
      }
    }
  }
  tsTypeStr += `${indent.slice(0, indent.length - 2)}}`;
  return tsTypeStr;
}

// 获取表格行的嵌套级别
function getTrLevel(tr: HTMLTableRowElement) {
  const levelMatch = tr.className.match(/ant-table-row-level-\d/);
  const level = Number(levelMatch[0].replace("ant-table-row-level-", ""));
  return level;
}

// 将java的类型转为ts的基础类型
function javaTypeToTsType(javaType: string) {
  if (javaType.includes("string")) return "string";
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
  function show(type: "success" | "error" | "info" | "warn", content: string) {
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
    success: (content: string) => show("success", content),
    error: (content: string) => show("error", content),
    info: (content: string) => show("info", content),
    warn: (content: string) => show("warn", content),
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
