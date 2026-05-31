---
date: 2026-05-31
tags: Java
---







# 文件



什么是文件

文件是 **保存数据的地方** 图片 文字 视频 音频 都是文件



## 文件流

文件是程序中是以流的形式来操作的



java程序(内存) <===> 文件（磁盘）

磁盘输入到内存中，内存输出到文件中



流：数据在数据源 和程序之间 经历的路径

输入流：从文件到内存的路径

输出流：从内存到文件的路径



# 常用的文件操作



创建文件对象相关的构造器和方法



相关方法

```java
new File(String pathname)//根据路径构建一个File对象
new File(File parent,String child)//根据父目录文件+子路径构建
new File(String parent,String child)//根据父目录+子路径构建
```



`createNewFile()` 创建新文件



应用案例演示：FileCreate.java



在e盘下创建文件，news1.txt,news2.txt,news3.txt 用三种不同方式创建



```java
package com.jl.stream_.createfile_;
import org.testng.annotations.Test;
import java.io.File;
import java.io.IOException;
public class FileCreate {
    public static void main(String[] args) {
    }
//    @Test
    public void creator1() {
        String filePath = "e:\\news1.txt";
        File file = new File(filePath);
        try {
            file.createNewFile();
            System.out.println("文件创建成功");
        } catch (IOException e) {
            System.out.println("文件创建失败");
            throw new RuntimeException(e);
        }
    }
//    @Test
    public void creator2() {
        String filePath1 = "e:\\";
        String child = "news2.txt";
        File file = new File(filePath1, child); //在内存中

        try {
            file.createNewFile(); //真正的创建对象
            System.out.println("news2创建成功");
        } catch (IOException e) {
            System.out.println("news2创建失败");
            throw new RuntimeException(e);

        }
    }
@Test
    public void creator3() {
        String parentPath = "e:\\";
        String child = "news3.txt";

        File file = new File(parentPath, child);

        try {
            file.createNewFile(); //真正的创建对象
            System.out.println("news3创建成功");
        } catch (IOException e) {
            System.out.println("news3创建失败");
            throw new RuntimeException(e);

        }
    }
}

```



> creator2 和creator3的区别在于两者指定的构造器不同,creator2中的第一个参数虽然是String类型,不过传入时实际上是File类型,而creator3则是String类型



## File常用方法



```java
package com.jl.stream_.file_;

import org.testng.annotations.Test;

import java.io.File;

public class FileInfo {
    public static void main(String[] args) {


    }

    @Test
    //    获取文件的信息
    public void info() {
//        先创建文件对象
        File file = new File("e:\\news3.txt");
//        调用相应的方法得到对应的信息
        System.out.println("文件名字：" + file.getName());
        System.out.println("文件绝对路径：" + file.getAbsolutePath());
        System.out.println("文件父目录：" + file.getParent());
        System.out.println("文件大小(字节)：" + file.length());
        System.out.println("文件是否存在(boolean)：" + file.exists());
        System.out.println("文件是否是文件(boolean)：" + file.isFile());
        System.out.println("文件是否是目录(boolean)：" + file.isDirectory());


    }
}

```







```terminal
文件名字：news3.txt
文件绝对路径：e:\news3.txt
文件父目录：e:\
文件大小(字节)：5
文件是否存在(boolean)：true
文件是否是文件(boolean)：true
文件是否是目录(boolean)：false
```







```java
package com.jl.stream_.file_;

import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;

public class DirectoryCreate {
    public static void main(String[] args) {

    }

    //    判断是否存在，存在就删除
    @Test
    public void m1() {

        String filePath = "e:\\news3.txt";

        File file = new File(filePath);
        if (file.exists()) {

            if (file.delete()) {
                System.out.println("删除成功");

            } else {
                System.out.println("删除失败");
            }

        } else {
            System.out.println("该文件不存在");
        }
    }

    //    在java编程中，目录也是一种文件
    @Test
    public void m2() {

        String filePath = "e:\\demo2";

        File file = new File(filePath);
        if (file.exists()) {

            if (file.delete()) {
                System.out.println("删除成功");

            } else {
                System.out.println("删除失败");
            }

        } else {
            System.out.println("该文件不存在");
        }
    }


    //    判断目录是否存在，如果存在就提示存在，如果不存在就创建
    @Test
    public void m3() {
        String filePath = "e:\\demo2";

        File file = new File(filePath);
        if (file.exists()) {

            System.out.println(filePath + "存在");


        } else {
//            创建一级目录使用mkdir  多级目录使用mkdirs
            if (file.mkdirs()) {
                System.out.println("创建成功");
            } else {
                System.out.println("创建失败");
            }
        }
    }
}
```





# Java IO流原理



1. I/O是input/output的缩写,是非常实用的技术,用于处理技术的传输,如读写文件,网络通讯等.
2. java程序中,对于程序的输入/输出操作 以流`Stream`的方式进行
3. java.io包下提供了各种"流"类和接口,用以获取不同种类的数据,并通过方法输入或输出数据
4. 输入 input:读取外部数据到内存中
5. 输出 output:将程序(内存等存储到设备中)

## 流的分类

按操作数据单位不同分为:字节流(8bit),字符流(按字符)

> 字节流的好处是 在操作二进制文件时，是一个字节一个字节来操作
>
> 字符流是按字符来操作的，具体几个字符无法说清楚，字符流的优势是文本文件，文本文件就是按字符存储
>
> 

按数据流的流向不同分为:输入流 输出流

按流的角色的不同分为:节点流,处理流/包装流



| 抽象基类 | 字节流       | 字符流 |
| -------- | ------------ | ------ |
| 输入流   | InputStream  | Reader |
| 输出流   | OutputStream | Writer |

> 字节流和字符流都是抽象类，在使用时需要创建他们的实现子类才可以



1. java的IO流一共涉及40个类，实际上非常规则，都是从如上四个抽象类派生的
2. 由这四个基类派生出来的子类名称都是以父类名作为子类名后缀



![image-20260531165159412](D:\Typora\TyporaPics\image-20260531165159412.png)





# 流和文件的关系



流 是作为单向管道，通向内存和存储



# IO流体系图-常用的类



InputStream ：字节输入流

InputStream抽象类是所有类字节输入流的超类

常用子类：

1. FileInputStream 文件输入流
2. BufferedInputStream 缓冲字节输入流
3. ObjectInputStream 对象字节输入流



## 文件输入流



```java
package com.jl.stream_.inputstream_;

import org.testng.annotations.Test;

import java.io.FileInputStream;
import java.io.IOException;

public class FileInputStream_ {
    public static void main(String[] args) {

    }

    @Test
    public void readFile01() {
        String filePath = "E:\\hello.txt";
        int readData = 0;
//        字节数组
        int readLen = 0;
        byte[] buffer = new byte[1024];
        FileInputStream fileInputStream = null;
        try {
            fileInputStream = new FileInputStream(filePath);

//            从该输入流读取最多b.length字节的数据到字节数组。此方法将阻塞
//            返回-1 表示读取完毕
//            如果读取正常，返回实际读取的字节数
            while ((readLen = fileInputStream.read(buffer)) != -1) {
                System.out.print(new String(buffer, 0, readLen));
            }
//            如果返回-1,表示读取完毕

        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
//            当文件读取完毕后，关闭文件流，释放资源
            try {
                fileInputStream.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}

```



## 文件输出流



```java
package com.jl.stream_.outputstream_;

import org.testng.annotations.Test;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;


public class OutputSteam01 {
    public static void main(String[] args) {

    }


    @Test
    public void writeFile() {
        FileOutputStream fileOutputStream = null;
        String filePath = "E:\\a.txt";

        try {

            /*
            new FileOutputStream(filePath) 创建方式 ,当写入内容时,会覆盖原来的内容,
            new FileOutputStream(filePath,true) 这种创建方式会追加到内容的最后
            */




            fileOutputStream = new FileOutputStream(filePath,true);

//            写入一个字节
//            fileOutputStream.write('a');
//            写入字符串
            String str = "hello,world!";
//            str.byte()可以把字符串->字节数组
//            fileOutputStream.write(str.getBytes());

            fileOutputStream.write(str.getBytes(), 0, str.length());
        } catch (IOException e) {

            throw new RuntimeException(e);
        } finally {
            try {
                fileOutputStream.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

    }
}

```



## 练习:拷贝文件



完成 文件拷贝, a.txt 拷贝到D盘,前提是文件存在

创建文件的输入流,将文件读入到程序
创建文件的输出流,将文件输出到硬盘

```java
package com.jl.stream_.copy_;

import org.testng.annotations.Test;

import java.io.*;

public class FileCopy_ {
    String filePath = "D:\\JavaProject\\chapter19\\out\\a.txt";
    String copyFilePath = "D:\\JavaProject\\chapter19\\out\\b.txt";
    String dir = "D:\\JavaProject\\chapter19\\out\\";


    public static void main(String[] args) {
//        完成 文件拷贝, a.txt 拷贝到D盘,前提是文件存在

//        创建文件的输入流,将文件读入到程序
//        创建文件的输出流,将文件输出到硬盘
    }

    @Test
    public void input() {
        File directory = new File(dir);
        if (!(directory.exists())) {

            System.out.println("目录不存在");
        } else {
//            条件判断如果两个文件存在,就执行程序,
            if (!(new File(filePath).exists())) {

//            否则提示文件不存在
                System.out.println("源文件不存在!");
            } else {


                copy();

            }
        }
    }

    public void copy() {
        byte[] buffer = new byte[8192];
        int readLen = 0;
        FileInputStream fileInputStream = null;
        FileOutputStream fileOutputStream = null;
        try {
            fileInputStream = new FileInputStream(filePath);
            fileOutputStream = new FileOutputStream(copyFilePath);
//            读取文件内容 int
            while ((readLen = fileInputStream.read(buffer)) != -1) {
                fileOutputStream.write(buffer, 0, readLen);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                fileInputStream.close();
                fileOutputStream.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        System.out.println("写入成功");
    }
}
```





## FileReader和FileWriter介绍



字节流,按照字符来操作IO



### FileReader

- `FileReader`相关方法
  - `new FileReader(File/String)`
  - `read`:每次读取单个字符,返回该字符,如果到文件末尾则返回-1
  - `read(char[])`:批量读取多个字符到数组,返回读取到的字符数,如果到文件末尾返回-1
- 相关api
  - `new String(char[])` 将`char[]`转换成`String`
  - `new String[char[],off,len]` 将`char[]`指定的部分转换成`String`



```java
package com.jl.stream_.filereader_;

import org.testng.annotations.Test;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class FileReader_ {
    public static void main(String[] args) {


    }


    //    使用字符读取文件
    @Test
    public void m1() {
        String filepath = "E:\\story.txt";
        FileReader fr = null;

        //单个字符读取
        int data = 0;


        try {
            fr = new FileReader(filepath);


            while ((data = fr.read()) != -1) {
                System.out.print((char) data);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (fr != null) {
                try {
                    fr.close();
                } catch (IOException e) {
                }
            }
        }


    }

    //    使用字符数组读取文件
    @Test
    public void m2() {
        String filepath = "E:\\story.txt";
        FileReader fr = null;

        int readLen = 0;
        char[] buffer = new char[1024];


        try {
            fr = new FileReader(filepath);
//
            while ((readLen = fr.read(buffer)) != -1) {
                System.out.print(new String(buffer, 0, readLen));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (fr != null) {
                try {
                    fr.close();
                } catch (IOException e) {
                }
            }
        }


    }

}

```







### FileWriter



- `FileWriter `常用方法
  - `new FileWriter(File/String)` 覆盖模式,相当于流的指针在顶端
  - `new FileWriter(File/String,true)` 追加模式,流的指针在末端
  - `write(int)`:写入单个字符
  - `write(char[])`:写入指定数组
  - `write(char[],off,len)`:写入指定数组的指定部分
  - `write(string)`:写入整个字符串
  - `write(string,off,len)`:写入字符串的指定部分
- 相关api:`String类`,`toCharArray` 将`String`转换成`char[]`



> FileWriter使用后,必须要关闭(close)或刷新(flush),否则写入不到指定的文件



```java
package com.jl.stream_.filewriter_;

import org.testng.annotations.Test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class FileWriter_ {
    public static void main(String[] args) {

    }

    @Test
    public void m1() {
        String filePath = "E:\\story.txt";

        FileWriter file = null;
        char[] chars = {1, 2, 3, 4, 5, 6};

        try {
            file = new FileWriter(filePath);

//            写入单个字符
            file.write('h');
//            写入指定数组
            file.write(chars);
//            写入数组的指定部分
            file.write("韩顺平教育", 0, 3);
//            写入整个字符串
            file.write("我Chovy给我拿好了呀!");
//            写入字符串的指定部分
            file.write("我Chovy给我拿好了呀!", 0, 6);

//            在数据量大时可以选择循环


        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                file.close();
            } catch (IOException e) {
            }
        }

    }

}


```





