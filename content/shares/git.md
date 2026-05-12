---
url: https://git-scm.com
tag: 教程
date: 2026-05-12
---

# Git + GitHub 入门 — 从零到推送

> 这是编程的人保命的工具，不是锦上添花。
> 认真看完，以后版本控制不再怕。

---

## 1. 注册 GitHub

打开 [github.com](https://github.com) → 右上角 Sign Up

- 用户名、邮箱、密码
- 验证邮箱（去收件箱点链接）

> 用户名决定你的 Pages 地址。比如用户名是 `abc`，Pages 就是 `abc.github.io`。
> 建议用英文，以后给人发链接方便。

---

## 2. 下载安装 Git

### Windows

https://git-scm.com/download/win

一直 Next，除了这一步需要留意：

```
安装时选择：
✅ Git from the command line and also from 3rd-party software
✅ Use Visual Studio Code as default editor
✅ Checkout Windows-style, commit Unix-style line endings
```

> 不要改安装路径，默认就行。
> 装完后打开 PowerShell，输 `git --version`，看到版本号说明装好了。

### macOS

```bash
brew install git
```

> 没装 Homebrew？去 https://brew.sh 装，一行命令。

---

## 3. 配置身份

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

> `--global` 表示全局配置，配一次就行。
> 这两个信息会出现在每次提交记录里，别人能看到。
> 邮箱用 GitHub 注册时的那个。

验证：

```bash
git config --global --list
```

---

## 4. 创建仓库

### 网页上新建

GitHub 首页 → 绿色 `New` 按钮

- Repository name：`java-notes`（随便填）
- Public
- ✅ Add a README file
- 点 Create repository

> 仓库名就是项目名。一个账号可以有无数个仓库。
> Public = 所有人都能看到。Private = 只有你能看到。免费版都不限数量。

### 本地初始化（已有项目）

```bash
cd D:\你的项目文件夹
git init
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

> `git init` 让当前文件夹变成 Git 仓库。
> `branch -M main` 把默认分支名改成 main（GitHub 的默认名）。
> `remote add origin` 告诉本地仓库：「远端在 GitHub 上这个地址」。

---

## 5. 基本 Git 工作流

### 查看状态

```bash
git status
```

> 任何时候不确定状态，跑这条。绿色=已暂存，红色=未暂存，Untracked=新文件。

### 添加文件

```bash
git add 文件名          # 添加单个文件
git add content/        # 添加整个文件夹
git add .               # 添加所有改动
```

> `git add` 把改动放进「暂存区」。可以理解为购物车——还没付钱，还能改。
> 每次 commit 前必须先 add。

### 提交

```bash
git commit -m "更新笔记"
```

> `-m` 后面是提交信息，写清楚这次改了什么。
> 坏例子：`update`、`fix`、`111`
> 好例子：`添加递归笔记`、`修复首页搜索框不显示`

### 推送

```bash
git push origin main
```

> 把本地的提交推送到 GitHub。
> 国内第一次推送大概率失败，因为 GitHub 被墙。需要配代理。

### 配代理（国内必做）

```bash
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

> `7897` 是你代理软件的 HTTP 端口。
> Clash 默认 7890/7897，V2Ray 默认 10809，看你用哪个。
> 不加代理连不上 GitHub，加错端口也一样。报 `Failed to connect` 就是代理问题。

验证代理：

```bash
curl -I https://github.com
```

> 有响应就说明代理通了。

---

## 6. 完整日常流程

```bash
# 0. 连代理（每次开机跑一次）
git config http.proxy http://127.0.0.1:7897
git config https.proxy http://127.0.0.1:7897

# 1. 查看改了哪些文件
git status

# 2. 加入暂存区
git add .

# 3. 提交
git commit -m "更新笔记"

# 4. 推送到 GitHub
git push origin main
```

> 第二步可以用 `git add 文件名` 只添加指定文件，不想把乱七八糟的文件也提交就用这个。
> 第一次用 Git 的人最容易忘 `git add`，直接 commit 会报 "nothing to commit"。

---

## 7. 克隆已有仓库

```bash
git clone https://github.com/用户名/仓库名.git
```

> 把 GitHub 上的项目下载到本地。
> 之后改完文件走一遍 add → commit → push。

---

## 8. 分支（了解即可）

```bash
git branch              # 查看当前分支
git branch 分支名       # 新建分支
git checkout 分支名     # 切换分支
git merge 分支名        # 合并分支
```

> 一个仓库可以有多个分支。main 是主分支。
> 个人项目就你一个人，直接在 main 上改没问题。团队协作才需要分支。

---

## 9. 常见问题

### push 时报错 "failed to push some refs"

```bash
git pull origin main --rebase
```

> 远端有你的本地没有的提交。先拉下来合并再 push。

### 提交信息写错了

```bash
git commit --amend -m "新的提交信息"
```

> 只能改最近一次 commit。改完如果已经 push 过了需要用 `git push --force`。

### 想撤销上一次 commit

```bash
git reset --soft HEAD~1
```

> `--soft` 保留文件改动，只撤销 commit。
> `--hard` 连文件改动一起删除，慎用。

### 怎么看改了哪些内容

```bash
git log              # 提交历史
git log --oneline    # 简洁版
git diff             # 查看未暂存的改动
```

> `git log` 按 q 退出。`git diff` 绿色是新增，红色是删除。

### Token 认证失败

```
remote: Invalid username or token.
```

> 现在 GitHub 不允许用密码 push，必须用 token。
> 去 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
> 生成一个新的，勾选 repo，复制 token。
> 推送时用：
> ```bash
> git remote set-url origin https://你的token@github.com/你的用户名/你的仓库名.git
> ```

---

## 10. 核心概念图

```
工作区             暂存区             本地仓库             GitHub
（你改文件）      （git add）        （git commit）      （git push）
  content/   ──→   暂存区    ──→   .git 本地仓库  ──→   GitHub
  index.md         购物车           拍照存档             上传到云端
```

> 理解这个图就理解了 Git 的核心。
> 三步缺一不可：add 放购物车 → commit 拍照 → push 上传。

---

> **记住三条就够了**：
> 1. `git add .` — 装车
> 2. `git commit -m "说明"` — 拍照
> 3. `git push origin main` — 上传
> 其他都是查了再用的。
