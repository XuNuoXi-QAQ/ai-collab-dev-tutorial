---
tags: 
source: 
---

1、桌面创建一个快捷方式
2、在“请键入对象的位置（T）”下方的文本框中输入：

taskkill /F /FI "USERNAME eq Administrator" /FI "IMAGENAME ne explorer.exe" /FI "IMAGENAME ne dwm.exe"

（代码中Administrator是当前电脑所登入的用户名）单击“下一步”然后修改快捷方式的名称（名称随便填，只要你懂的就行） 单击“完成”

[![](https://img2018.cnblogs.com/blog/792361/201811/792361-20181101211125586-457770514.png)](https://img2018.cnblogs.com/blog/792361/201811/792361-20181101211125586-457770514.png)

3、创建完成后，双击你创建的快捷文件，一会儿会弹出cmd命令终端，并在此执行命令，执行完成后电脑会黑屏一下，这正常
