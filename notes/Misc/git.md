---
date: 2026-06-05
tag: Git
---



# git 入门

Git教程链接:

[【从零开始深入 git】 ](https://www.bilibili.com/video/BV1MjRmBJEnK?vd_source=8894cf0c7837b0e61e7fd03d0f30f834&spm_id_from=333.788.videopod.sections) by [寰宇牛奶unimilk](https://space.bilibili.com/3706985490942278)

> 本文只为简单讲解,详细讲解请参考教程



## 三大核心要点

### 1. **新建仓库的“双向”思维**

- **GitHub 端**：新建仓库时，如果勾选了 README/.gitignore，远程就有了“初始提交”
- **本地端**：`git init` 创建的是空的本地仓库
- **冲突点**：两边的提交历史无关，直接 `git push` 会报错
- **解决方案**：`git pull origin main --allow-unrelated-histories`

### 2. **仓库连接的“地址匹配”**

- `git remote add origin <url>` 建立了本地到远程的桥梁
- **HTTPS vs SSH**：
  - HTTPS：需要输入账号/Token，适合快速克隆公开项目
  - SSH：配置一次，免密推送，更适合日常开发
- **修改地址**：`git remote set-url origin <新地址>`

### 3. **SSH 连接的“钥匙思维”**

- **生成钥匙**：`ssh-keygen -t rsa -b 4096`
- **公钥放 GitHub**：Settings → SSH and GPG keys
- **私钥留本地**：`~/.ssh/id_rsa`
- **验证连接**：`ssh -T git@github.com` → 看到用户名即成功

## 一个完整的“零出错”流程



1. GitHub 新建仓库（不勾选任何文件）

   ```bash
   # 1. GitHub 新建仓库（不勾选任何文件）
   # 2. 本地初始化
   git init
   git add .
   git commit -m "first commit"
   ```

   

2. 配置 SSH（首次使用）

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your@email.com"
   ```

   

3. 连接并推送

   ```bash
   git remote add origin git@github.com:用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```





> 省流

```bash
# 1. GitHub 新建仓库（不勾选任何文件）
# 2. 本地初始化
git init
git add .
git commit -m "first commit"

# 3. 配置 SSH（首次使用）
ssh-keygen -t rsa -b 4096 -C "your@email.com"
# 将公钥添加到 GitHub

# 4. 连接并推送
git remote add origin git@github.com:用户名/仓库名.git
git branch -M main
git push -u origin main
```



