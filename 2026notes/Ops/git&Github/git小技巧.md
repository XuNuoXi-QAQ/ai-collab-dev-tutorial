---
title: "git小技巧"
tags:
  - Git
  - GitHub
  - 版本控制
description: "执行一次 git config --global alias.ac '!git add -A && git commit -m' 后，以后你只需要敲："
created: 2026-06-23
---

执行一次 git config --global alias.ac '!git add -A && git commit -m' 后，以后你只需要敲：
bash

git ac "你的提交信息"

它就会自动执行：

    git add -A（添加所有变更，包括新文件、修改、删除）

    git commit -m "你的提交信息"

🔥 如果你想「添加 + 提交 + 推送」三步合一

可以再设置一个带 push 的别名：
bash

git config --global alias.acp '!git add -A && git commit -m && git push'

之后使用：
bash

git acp "你的提交信息"

一步到位，连推送都省了。
⚠️ 两个使用细节提醒

    git add -A 会添加所有变更，包括当前目录及子目录的所有改动。如果你只想添加当前目录（.）而非整个仓库，可以用 git add . 替代，但别名里统一用 -A 更保险，因为它是“全部”的意思，无论你当前在哪个子目录下都生效。

    如果仓库里有些文件你永远不想提交（比如 .env 或 node_modules），一定要写进 .gitignore，否则 -A 会把它们也加进去。
