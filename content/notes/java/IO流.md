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



# 节点流 和 处理流



> 这里好乱啊,请求AI支援



弹幕:

> 节点流是你只能点米饭，白菜，肉丝，白粥；包装流是你可以点早餐，午餐，晚餐，给包装流说一下你要吃什么类型的就行了

> 简单地说就是文件只能用文件流，数组只能用数组流，字符串只能用字符串流，但是这玩意可以用所有流





1. 节点流可以从一个特定的数据源读写数据
2. 处理流（包装流）是连接在已存在的流（节点流或处理流）之上，为程序提供更为强大的读写能力（如BufferedReader，BufferedWriter）





程序操作数组

`ByteArrayInputStream`、`ByteArrayOutputStream`

`BufferedReader`，`BufferedWriter`



BufferedReader 类中,有属性Reader,即可以封装一个节点流,该节点流可以是任意的. 只要是Reader的子类就可以了



## 节点流和处理流的区别和联系



1. 节点流是底层流/低级流,可以直接跟数据源相接
2. 处理流包装节点流,既可以消除不同节点的实现差异,也可以提供更方便的方法来完成输入输出
3. 处理流(包装流)对节点流进行包装,使用了修饰器设计模式,不会直接与数据源相连



**处理流的功能主要体现在以下两个方面:**



1. 性能的提高,主要以增加缓冲的方式来提高输入输出的效率.
2. 操作的便携,处理流可能提供了一系列便携的方法来一次输出大批量的数据,使用更加灵活方便



# 处理流: BufferedReader和BufferedWriter

属于字符流,是按照字符来读取数据的

关闭时只需要关闭外层流即可



## 应用案例



### BufferedReader

```java
package com.jl.stream_.reader_;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class BufferedReader_ {
    public static void main(String[] args) throws IOException {
        String filePath = "C:\\Users\\chens\\Desktop\\泛型.md";
//        创建BufferedReader
        BufferedReader bufferedReader = new BufferedReader(new FileReader(filePath));
//        读取
        String line;

//        当返回为null时表示读取完毕
        while ((line = bufferedReader.readLine()) != null) {
            System.out.println(line);
        }

//        关闭流
        bufferedReader.close();
        
//        close源码:
        
//        public void close() throws IOException {
//        synchronized (lock) {
//            if (in == null)
//                return;
//            try {
//                in.close();
//            } finally {
//                in = null;
//                cb = null;
//            }
//        }
//    }

    }
}

```



### BufferedWriter



使用BufferedWriter 将”hello,韩顺平教育”，写入到文件中



```java
package com.jl.stream_.reader_;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class BufferedWriter_ {
    public static void main(String[] args) throws IOException {
//        定义路径
        String fileName = "E:\\story.txt";
//        新建bw对象,构造器中写对应的流,对应的流中写好路径
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(fileName));

//        定义要写入的文本
        String line = "雨下整夜...";
        String line2 = "我的爱溢出就像雨水...";

//        写入
        bufferedWriter.write(line);
//        写入换行符
        bufferedWriter.newLine();
//        再次写入
        bufferedWriter.write(line2);

//        关闭流 
        bufferedWriter.close();


    }
}
```





### BufferedCopy

3)综合使用BufferedReader 和 BufferedWriter 完成文本文件拷贝，注
意文件编码 



```java
package com.jl.stream_.reader_;

import java.io.*;

public class BufferedCopy_ {
    public static void main(String[] args) throws IOException {

        String fileName = "E:\\story.txt";
        String fileCopy = "E:\\hello.txt";

        BufferedReader bufferedReader = new BufferedReader(new FileReader(fileName));
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(fileCopy));
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            bufferedWriter.write(line);
            bufferedWriter.newLine();

        }
        bufferedReader.close();
        bufferedWriter.close();


//        因为Reader和Writer是字符流,所以不能操作二进制文件,会导致文件读取数据错误,如音乐,图片,视频
        
//        弹幕:现在练习用throw可以精简代码，但如果真的出现异常，则下面的代码就不能继续执行了，包括关闭流语句
//        所以实际使用时还是要用try-catch-finally，才能确保不管有没有异常都能关闭流。
    }
}

```





> 
> 因为Reader和Writer是字符流,所以不能操作二进制文件,会导致文件读取数据错误,如音乐,图片,视频
> 

> 弹幕:现在练习用throw可以精简代码，但如果真的出现异常，则下面的代码就不能继续执行了，包括关闭流语句
> 所以实际使用时还是要用try-catch-finally，才能确保不管有没有异常都能关闭流。



# 节点流





BufferedInputStream

BufferedOutputStream





## 案例 Copy02



使用字节流进行Copy



```java
package com.jl.stream_.reader_;

import java.io.*;

public class BufferedCopy02_ {
    public static void main(String[] args) {

        String fileName = "E:\\JavaTest\\END1.png";
        String fileCopy = "E:\\JavaTest\\END1copied.png";

        BufferedInputStream bufferedInputStream = null;
        BufferedOutputStream bufferedOutputStream = null;
        try {
            bufferedInputStream = new BufferedInputStream(new FileInputStream(fileName));
            bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(fileCopy));
            byte[] bytes = new byte[1024];
            int length ;

            while ((length = bufferedInputStream.read(bytes)) != -1) {
                bufferedOutputStream.write(bytes, 0, length);


            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {

            try {
                bufferedOutputStream.close();
                bufferedInputStream.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            System.out.println("copyOK!");
        }


    }
}

```



> 通过与ReaderWriter的对比可以知道,最简单的读写大概只是数据类型的不同,字节流选择用Byte作为单位,Copy1中选择String 并一次读取一整行作为单位







# 对象流 Object In/Output Stream



需求：

1. 将 `int num =100;` 这个int数据保存到文件中，注意不是100，而是`int`类型的100，并且能够从文件中直接回复为`int`100
2. 将 `Dog dog = new Dog("小黄",3);`这个Dog对象保存到文件中，并且能从文件中恢复，
3. 上面的要求，就是能够将基本数据类型 或者对象进行序列化 和反序列化操作



## 序列化和反序列化

1. 序列化就是在保存数据时，保存**数据的值**和**数据类型**

2. 反序列化就是在恢复数据时，恢复**数据的值**和**数据类型**

3. 需要将某个对象支持序列化机制，则必须让其类是可序列化的，为了让某个类是可序列化的，该类必须实现如下两个接口之一：

   `Serializable`  //这是一个标记接口

   `Externalizable` //该接口有方法需要实现

推荐使用`Serializable`



## ObjectOutputStream



```java
package com.jl.stream_.outputstream_;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;

public class ObjectOutputStream_ {
    public static void main(String[] args) throws IOException {

//        序列化后，保存的文件格式不是纯文本，而是按照它的格式来保存
        String filePath = "E:\\JavaTest\\data.txt";

        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filePath));

//        序列化文件到 filePath

        oos.writeInt(100); //int -> Integer (实现了 Serializable 接口)
        oos.writeBoolean(true); //boolean ->Boolean
        oos.writeDouble(123.45);
        oos.writeFloat(123.45F);
        oos.writeChar('h');
        oos.writeUTF("hello"); //String 实现了Serializable

//        保存一个Dog对象
        oos.writeObject(new Dog("旺财", 10)); // Dog对象没有实现Serializable接口会抛出异常
        // NotSerializableException
        // 需要对类进行实现


        oos.close();

        System.out.println("保存完毕.");

    }
}

```



## ObjectInputStream



```java
package com.jl.stream_.inputstream_;


import com.jl.stream_.outputstream_.Dog;

import java.io.FileInputStream;
import java.io.ObjectInputStream;

public class ObjectInputStream_ {
    public static void main(String[] args) throws Exception {

        String filePath = "E:\\JavaTest\\data.txt";
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filePath));

//        读取数据的反序列化的顺序需要和序列化时的顺序一致
//        否则会出现异常
//
//        更改了序列化的类等之后,需要重新序列化,再进行反序列化

        System.out.println(ois.readInt());
        System.out.println(ois.readBoolean());
        System.out.println(ois.readDouble());
        System.out.println(ois.readFloat());
        System.out.println(ois.readChar());
        System.out.println(ois.readUTF());


//        Dog的编译类型是Object,运行类型是Dog
        Object o = ois.readObject();
        System.out.println(o.getClass());
        System.out.println(o);

//        如果我们需要调用Dog的方法,需要进行向下转型
//        还需要将类进行公有化,因为类会就近选择
        Dog dog = (Dog) o;
        System.out.println(dog.getName());
        System.out.println(dog.getAge());


    }
}

```



## 对象处理流注意事项和使用细节



1. 读写顺序要一致
2. 要求实现序列化或反序列化对象，需要实现 `Serializable`
3. 序列化的类中建议添加SerivalVersionUID，为了提高版本的兼容性
4. 默认将里面所有属性都进行序列化，但除了static或transient修饰的成员
5. 要求里面属性的类型也需要实现序列化接口
6. 序列化具备可继承性，也就是如果某类已经实现序列化，则他的所有子类也默认实现了序列化



```java
public class Master implements Serializable {
}
```



```java
public class Dog implements Serializable {
    //    序列化的版本号，可以提高兼容性
    private static final long serialVersionUID = 1L;
    //    static修饰符
    private static String nation;
    private String name;
    private int age;
    //    transient修饰符
    private transient String color;

    private Master master = new Master();

```



# 标准输入/输出流





| 标准流       | 类型         | 默认设备 |
| ------------ | ------------ | -------- |
| `System.in`  | InputStream  | 键盘     |
| `System.out` | OutputStream | 显示器   |



```java

package com.jl.stream_.standard;

import java.util.Scanner;

public class InputAndOutput {
    public static void main(String[] args) {


//        System.in 的编译类型是 InputStream
//        System.in 的运行类型是 BufferedInputStream 缓冲流
//        表示标准输入：键盘
        System.out.println(System.in.getClass());

        System.out.println("请输入内容");
        Scanner scanner = new Scanner(System.in);

        System.out.println(scanner.next());


//        System.in 的编译类型是 PrintStream
//        System.in 的运行类型是 PrintStream 打印流
//        表示标准输出：显示器
        System.out.println(System.out.getClass());

        System.out.println("Hello World!");
        System.out.println("Hello Jason!");


    }
}

```





# 转换流



把字节流转成字符流：

`InputStreamReader` 和 `InputStreamWriter`



1. InputStreamReader ：Reader的子类， 可以将InputStream（字节流）包装成Reader（字符流）
2. OutputStreamWriter：Writer的子类，可以将OutputStream（字节流）包装成Writer（字符流）
3. 当处理纯文本数据时，如果使用字符流效率更高，并且可以有有效解决中文问题，所以建议将字节流转换成字符流
4. 可以在使用时指定编码格式（比如UTF-8，GBK，GB2312，ISO8859-1）等



**将字节流转成字符流,指定编码**

```java
package com.jl.stream_.transformation;

import sun.nio.cs.ext.GBK;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class InputStreamReader_ {
    public static void main(String[] args) throws Exception {
//        将字节流转成字符流,指定编码
        String filePath = "E:\\JavaTest\\hello.txt";
////       1. 把 new FileInputStream 转成 InputStreamReader ,同时指定编码
//        InputStreamReader gbk = new InputStreamReader(new FileInputStream(filePath), "utf-8");
////       2. 把 gbk 传给BufferedStreamReader
//        BufferedReader bufferedReader = new BufferedReader(gbk);


//        将2和3合在一起写
//        BufferedReader bufferedReader = new BufferedReader(
//        new InputStreamReader(
//        new FileInputStream(filePath), "utf-8"));

        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), "utf-8"));


//       3. 读取
        String s = bufferedReader.readLine();
        System.out.println("读取内容= \"" + s + "\"");
//       4. 关闭外层流

        bufferedReader.close();

    }
}

```





```java
package com.jl.stream_.transformation;

import java.io.FileOutputStream;
import java.io.OutputStreamWriter;

public class OutputStreamWriter_ {
    public static void main(String[] args) throws Exception {
        String filePath = "E:\\JavaTest\\hello.txt";
        String charset = "utf-8";
        OutputStreamWriter oSW = new OutputStreamWriter(new FileOutputStream(filePath), charset);

        oSW.write("hello");

        oSW.close();
        System.out.println("按照" + charset + "运行文件");
    }
}

```





## 打印流



## PrintStream 和PrintWriter



打印流只有输入流 没有输出流



### PrintStream



```java
package com.jl.stream_.print_;

import java.io.IOException;
import java.io.PrintStream;

public class PrintStream_ {
    public static void main(String[] args) throws IOException {

        PrintStream out = System.out;
//        在默认情况下，PrintStream 输出数据的位置是标准输出 即 显示器
        out.print("helloJason");

//        print源码：
//        public void print(String s) {
//        if (s == null) {
//            s = "null";
//        }
//        write(s);
//    }
//        真正进行输出的是write方法
        System.out.println();

//        本质一样
        out.write("hellojasons".getBytes());


//        我们可以去修改打印流输出的位置 / 设备
//        修改到 "E:\\JavaTest\\log1.txt"
        System.setOut(new PrintStream("E:\\JavaTest\\log1.txt"));

        //    public static void setOut(PrintStream out) {
        //        checkIO();
        //        setOut0(out);
        //    }

//       ⬆️ 这是个native方法，修改了out

//        此字符串就会输出到 "E:\\JavaTest\\log1.txt"
        System.out.println("helloJason");

    }
}

```



### PrintWriter



```java
package com.jl.stream_.print_;

import java.io.FileWriter;
import java.io.PrintWriter;

public class PrintWriter_ {
    public static void main(String[] args) throws Exception {


//        PrintWriter printWriter = new PrintWriter(System.out);

        String filePath = "E:\\JavaTest\\log2.txt";
        PrintWriter printWriter = new PrintWriter(new FileWriter(filePath));
        printWriter.print("helloJason");

//        如果不关闭Writer，log就不会刷新
        printWriter.close();
    }
}

```



# Properties类



通过传统方法引入Properties类

```java
package properties_;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Properties_ {
    public static void main(String[] args) throws IOException {
//        读取mysql.properties 文件，并得到相应的ip user psw
        BufferedReader bufferedReader = new BufferedReader(new FileReader("src\\mysql.properties"));

        String line = "";
        while ((line = bufferedReader.readLine()) != null) {
            String[] split = line.split("=");
            System.out.println(split[0]+" 's value = "+split[1]);
        }
        bufferedReader.close();
    }
}

```



> 如果我们要求指定得到ip的值，还需要在while循环中进行判断split[0]是否在字符串中equals(ip),再输出spilit[1] 很麻烦



## 介绍



1. 专门用于读写配置文件的集合类

   配置文件的格式： `key=value` 

2. 注意：键值对不需要有空格，值也不需要用引号，默认类型是String



## 常见方法



- `load`：加载配置文件的键值到Properties对象
- `list`：将数据显示到指定设备
- `getProperty(key)` 根据键获取值
- `setProperty(key,value)` 设置键值对到Properties对象
- `store` 将Properties中的键值对存储到配置文件,在idea中,保存信息到配置文件,如果含有中文,会存储为Unicode码



```java
package properties_;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

public class Properties03 {
    public static void main(String[] args) throws IOException {
//        创建properties文件，修改文件内容
        Properties properties = new Properties();

//        创建
//        如果该文件没有 这个key,那么set就是创建
//        如果该文件有 这个key, 那么set就是修改


        properties.setProperty("charset", "utf-8");
        properties.setProperty("user", "jason");
        properties.setProperty("password", "admin");

//        将kv存储到文件中
        properties.store(new FileOutputStream("src\\mysql2.propreties"),"hello world");
        System.out.println("成功保存");

    }
}

```



```java

        /*
        * Properties 的父类是Hashtable ,所以底层就是Hashtable 核心方法 put
        *
        *   public synchronized V put(K key, V value) {
        // Make sure the value is not null
        if (value == null) {
            throw new NullPointerException();
        }

        // Makes sure the key is not already in the hashtable.
        Entry<?,?> tab[] = table;
        int hash = key.hashCode();
        int index = (hash & 0x7FFFFFFF) % tab.length;
        @SuppressWarnings("unchecked")
        Entry<K,V> entry = (Entry<K,V>)tab[index];
        for(; entry != null ; entry = entry.next) {
            if ((entry.hash == hash) && entry.key.equals(key)) {
                V old = entry.value;
                entry.value = value; //如果存在就替换
                return old;
            }
        }

        addEntry(hash, key, value, index); //如果是新的key 就addEntry
        return null;
    }
        * */
```





# 作业



## 编程题 Homework01.java

(1)在判断e盘下是否有文件夹mytemp，如果没有就创建mytemp

(2)在e:\\mytemp 目录下，创建文件 hello.txt

(3)如果hello.txt已经存在，提示该文件已经存在，就不要再重复创建了



```java
package properties_hm;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class hm1 {
    public static void main(String[] args) throws IOException {

        String filePath = "src\\mytemp";
        File file = new File(filePath);

        if (!file.exists()) {
            System.out.println("正在创建文件夹...");
            file.mkdir();
            String filePath1 = filePath + "\\hello.txt";
            File file1 = new File(filePath1);
            if (!file1.exists()) {
                System.out.println("创建文件中...");
                file1.createNewFile();

                BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(file1));
                bufferedWriter.write("hello,world~");

                bufferedWriter.close();

            } else {
                System.out.println("文件已经存在!");
            }
        }else {
            System.out.println("文件已经存在");
        }
        System.out.println("hm1完成");
    }
}
```



## 编程题 Homework02.java


使用BufferedReader读取一个文本文件，为每行加上行号，再连同内容一并输出到屏幕上。





```java
package properties_hm;

import java.io.*;

public class hm2 {
    public static void main(String[] args) throws IOException {

        String filePath = "src\\mytemp\\hello.txt";

        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), "utf-8"));        String line;
        int count = 0;
        while ((line = bufferedReader.readLine()) != null) {

            System.out.println(++count + " " + line);
        }
        if (bufferedReader!=null){
            bufferedReader.close();
        }
    }
}

```





## 编程题 Homework03.java
(1)要编一个dog.properties
name=tom
age=5
color=red

(2)编写Dog类(name,age,color)创建一个dog对象，读取dog.properties 用相应的内容完成属性初始化，并输出





```java
package properties_hm;


import java.io.*;
import java.util.Properties;

public class hm3 {
    public static void main(String[] args) throws IOException, ClassNotFoundException {

        String filePath = "src\\mytemp\\dog.properties";

        File file = new File(filePath);


        Properties properties = new Properties();

        properties.setProperty("name", "大黄");
        properties.setProperty("age", String.valueOf(3));
        properties.setProperty("color", "黑色");

        properties.store(new FileOutputStream(file), "hm3 properties output.");

        properties.load(new FileReader(file));

        String name = properties.getProperty("name");
        int age = Integer.parseInt(properties.getProperty("age"));
        String color = properties.getProperty("color");

        Dog dog = new Dog(name, age, color);

        System.out.println(dog);

//        将创建的Dog对象,序列化保存到文件dog.dat文件

        System.out.println("正在将创建的 Dog对象 序列化保存到文件dog.dat文件...");

        String dogData = "src\\mytemp\\dog.dat";

        System.out.println("正在创建输出流");
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(dogData));

        System.out.println("正在保存对象");
        oos.writeObject(dog);

        System.out.println("正在创建输入流");
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(dogData));
        System.out.println("正在读取对象");
        Object o = ois.readObject();

        System.out.println("转换对象运行类型...");
        Dog d = (Dog) o;

        System.out.println("dog.dat反序列化成功,读取内容如下");

        System.out.println(d);


    }
}

class Dog implements Serializable {
    private String name;
    private int age;
    private String color;


    public Dog(String name, int age, String color) {
        this.name = name;
        this.age = age;
        this.color = color;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "Dog{" + "name='" + name + '\'' + ", age=" + age + ", color='" + color + '\'' + '}';
    }
}
```



