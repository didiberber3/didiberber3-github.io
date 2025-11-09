---
title: Markdown语法
date: 2025-01-01
archive: 2025
tags:
  - 语言
  - 学习
  - "Markdown"
  - 语法
info: 此文为 Markdown 最基础语法
link: https://markdown.com.cn/basic-syntax
---



# 标题 `#`

```
各级标题由各级标题的 # 数量决定, 例如：

### 三级标题
#### 四级标题 
```

# 分割线 `---` / `***`

为了兼容性，请在分隔线的前后均添加空白行。

---


---
# 粗体 `**Text**`

`**This the test**`
**This is the test (bold)**
This is the test (standard)


---
# 引用 `>`

`>`

> 这是一个引用文本
> 文本引用可以换行，每一行都加上 `>`
>> 再加上一个 `>` 进行嵌套
>>> 多层嵌套 (多层嵌套挺麻烦的，最后要一个一个括回去 所以如果不自己删除一直回车就会变成)
>>
> 

> 但是没有嵌套的时候他是这样的，两层回车就可以继续下一行



---
# 列表 `1.` / `-` / `+` / `*`
1. **有序列表**回车后会自动拉长
2. 就像这样
3. 可以嵌套
   4. 操作略微麻烦，一般不喜欢用
   5. 没有特别好用的结束的方法
6. 双击回车结束列表


- `-` 和 `+` 、`*` 都是**无序列表**
+ 但是看起来 `+` 的无序列表要远一点
+ 可能跟 css 有关
* 但是很奇怪，- * 都没有问题，只有+看起来更远一点，同样，也可以嵌套，不喜欢用


---
# 代码块  `` ` ``

`单行的用一个反引号`
``转义反引号用两个` ``

```
 多行的用三个
 ```


---
# 链接 

>  网站链接一定要写全 `https://bing.com`
## 超链接: 

`Ctrl+左键` 光标选中超链接以打开链接
1. 超链接会跳转到**目标文件**
2. 网址会直接打开**目标网站**
3. 邮箱会变成邮箱的**收信人**
4. **Bold** 语法在这里可用，如果需要转义，请在 `[]` 中添加 `` ` `` 
[百度](https://baidu.com)
[https://bing.com](https://bing.com)
[didiberberob@163.com](mailto:didiberberob@163.com)

**[Name](website "Title")**
**[https://bing.com](https://bing.com)**
[didiberberob@163.com](mailto:didiberberob@163.com)

```
[Name](website "Title")
<https://bing.com>
<didiberberob@163.com>

**[Name](website "Title")**
**<https://bing.com>**
**<didiberberob@163.com>**

```

##   引用链接 `[1]`  /  `[1]:`

Bing [1]
Site[2]
引用链接不可以跳转，但可以在段落后或文档结尾标注出以显示其去处

[1]: http://bing.com
[2]: [Name](website "Title")

# 图片


```
![This is a pic](https://cdn.jsdelivr.net/gh/ddberber/imagebed/wechat_2024-12-14_161153_226.png)
```

![This is a pic](https://cdn.jsdelivr.net/gh/ddberber/imagebed/wechat_2024-12-14_161153_226.png)

```
[![This is a pic](https://cdn.jsdelivr.net/gh/ddberber/imagebed/wechat_2024-12-14_161153_226.png)](bing.com)
```

[![This is a pic](https://cdn.jsdelivr.net/gh/ddberber/imagebed/wechat_2024-12-14_161153_226.png)](https://bing.com)





---
