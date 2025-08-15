// ==UserScript==
// @name         MoDao Screen Text Extractor with Levels + StartLevel开关
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  V1.6 在 MoDao 页面提取 screen 文本路径，可自定义层级范围、起始节点，支持 startLevel 开关控制路径起点
// @author       jkm
// @match        https://modao.cc/proto/*/sharing*
// @updateURL    https://raw.githubusercontent.com/iaaiNG/MoDao-Screen-Text-Extractor/main/modao-screen-text-extractor.user.js
// @downloadURL  https://raw.githubusercontent.com/iaaiNG/MoDao-Screen-Text-Extractor/main/modao-screen-text-extractor.user.js
// @grant        none
// ==/UserScript==


(function () {
  'use strict'

  // 创建固定面板
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '10px'
  container.style.right = '10px'
  container.style.zIndex = 9999
  container.style.backgroundColor = '#fff'
  container.style.padding = '10px'
  container.style.border = '1px solid #ccc'
  container.style.borderRadius = '4px'
  container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)'
  container.style.fontFamily = 'sans-serif'
  container.style.maxWidth = '350px'
  document.body.appendChild(container)

  // 输入框：起始节点 (CSS/XPath)
  const nodeInput = document.createElement('input')
  nodeInput.type = 'text'
  nodeInput.placeholder = '起始节点 selector 或 XPath，默认 .sm-list'
  nodeInput.style.width = '100%'
  nodeInput.style.marginBottom = '5px'
  container.appendChild(nodeInput)

  // 输入框：起始层
  const startInput = document.createElement('input')
  startInput.type = 'number'
  startInput.min = '1'
  startInput.value = '3'
  startInput.style.width = '40px'
  startInput.style.marginRight = '5px'
  container.appendChild(startInput)
  container.appendChild(document.createTextNode('起始层 '))

  // 输入框：结束层
  const endInput = document.createElement('input')
  endInput.type = 'number'
  endInput.min = '1'
  endInput.value = '5'
  endInput.style.width = '40px'
  endInput.style.marginRight = '5px'
  container.appendChild(endInput)
  container.appendChild(document.createTextNode('结束层 '))

  // 开关：是否从 startLevel 层级开始收集路径
  const startLevelOnlyCheckbox = document.createElement('input')
  startLevelOnlyCheckbox.type = 'checkbox'
  startLevelOnlyCheckbox.checked = false
  startLevelOnlyCheckbox.style.marginLeft = '5px'
  container.appendChild(startLevelOnlyCheckbox)
  container.appendChild(document.createTextNode('仅从起始层开始打印'))

  // 按钮
  const btn = document.createElement('button')
  btn.textContent = '打印输出'
  btn.style.marginLeft = '5px'
  btn.style.padding = '5px 10px'
  btn.style.backgroundColor = '#409EFF'
  btn.style.color = '#fff'
  btn.style.border = 'none'
  btn.style.borderRadius = '4px'
  btn.style.cursor = 'pointer'
  container.appendChild(btn)

  // 核心函数：递归抓取文字路径
  function getTextPathsByLevelRange(root, startLevel = 1, maxLevel = Infinity, startLevelOnly = false) {
    const result = []

    function dfs(node, path, level) {
      if (!node)
        return

      const span = node.querySelector(':scope > div .editable-span')
      if (span) {
        if (startLevelOnly && level < startLevel) {
          // 不累积 startLevel 前的文字
        } else {
          path.push(span.textContent.trim())
        }
      }

      if (level >= startLevel && level <= maxLevel) {
        result.push(path.join('/'))
      }

      if (level < maxLevel) {
        const childUl = node.querySelector(':scope > ul.child-screens')
        if (childUl) {
          childUl.querySelectorAll(':scope > li').forEach((childLi) => {
            dfs(childLi, [...path], level + 1)
          })
        }
      }
    }

    if (!root)
      return []
    if (root.tagName.toLowerCase() === 'ul') {
      root.querySelectorAll(':scope > li').forEach(li => dfs(li, [], 1))
    } else if (root.tagName.toLowerCase() === 'li') {
      dfs(root, [], 1)
    } else {
      const ul = root.querySelector('ul')
      if (ul)
        ul.querySelectorAll(':scope > li').forEach(li => dfs(li, [], 1))
    }

    return result
  }

  // 解析输入节点
  function getRootNode(input) {
    if (!input)
      return document.querySelector('.sm-list')
    input = input.trim()
    if (!input)
      return document.querySelector('.sm-list')

    // 尝试 XPath
    if (input.startsWith('/')) {
      try {
        const result = document.evaluate(input, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        if (result && result.singleNodeValue)
          return result.singleNodeValue
      } catch (e) {
        console.warn('XPath 无效，尝试 CSS selector')
      }
    }

    // 尝试 CSS selector
    try {
      const node = document.querySelector(input)
      if (node)
        return node
    } catch (e) {
      console.warn('CSS selector 无效')
    }

    console.warn('未找到有效节点，使用默认 .sm-list')
    return document.querySelector('.sm-list')
  }

  // 按钮事件
  btn.addEventListener('click', () => {
    const startLevel = Number.parseInt(startInput.value, 10)
    const endLevel = Number.parseInt(endInput.value, 10)
    const startLevelOnly = startLevelOnlyCheckbox.checked

    if (isNaN(startLevel) || isNaN(endLevel) || startLevel < 1 || endLevel < startLevel) {
      alert('请输入有效的起始层和结束层')
      return
    }

    const rootNode = getRootNode(nodeInput.value)
    if (!rootNode) {
      alert('未找到起始节点')
      return
    }

    const paths = getTextPathsByLevelRange(rootNode, startLevel, endLevel, startLevelOnly)
    if (paths.length === 0) {
      alert('未找到任何路径')
      return
    }

    console.log(paths.map((p, i) => `前端-${i + 1 < 10 ? '0' : ''}${i + 1}.${p}`).join('\n'))
    alert('已打印到控制台')
  })
})()
