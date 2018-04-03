# 移动端活动页模板

用于快速实现移动端活动页H5，CSS与JS会内联到HTML，最终构建出单一个HTML文件。

主要功能有：flexible响应移动端，px转rem，自定义图片内联；

默认 1rem = 75px,  750 * 1334 iphone6s

---
## 使用

代码写在`src`文件里，图片放在`src/assets`

`npm start` 就可以运行，使用了browserSync 自动刷新浏览器

### index.html

页面内容写在这个文件里。

img图片需要转base64的这样写：`<img src="..." inline>`；
script, link标签一样可以这样来内联。

### main.js

没有转码，只可以写原生JS，也没有依赖加载机制

> todo: babel, require


### main.css

没有预处理器, 有 prefixer;

图片需要内联的用`inline()`, 例如：`background-image: inline("...")`

另外编译过程会生成`src/_temp`不用理会（后面想办法去掉）

> todo: less


---
## 问题

有任何需求、疑问欢迎提ISSUE