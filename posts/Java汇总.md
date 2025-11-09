---
title: Java汇总
date: 2025-11-08
tags: Java
category: Note
---



# 目录



[TOC]



# 变量与数据类型

## ASCII字符编码表

![img](D:\Typora\TyporaPics\ascii-1-1.png)

## 变量类型

![image-20250829231440352](D:\Typora\TyporaPics\image-20250829231440352-1757315437442-1.png)

- int[4] 只保留整数 / 水仙花
- double[8] 浮点（小数/一般数）
- float[4]
- char[2] 存放单个字符，如 'a' / '男'
- boolean[1] 存放真假 T/F

---

## 示例：基础变量与转义字符

```java
// public class Main 表示Main是一个类，是一个public公有的类
// Main{ } 表示一个类的开始和结束
// public static void main(String[] args) 表示一个主方法，即程序的入口
// { }方法的开始和方法的结束
// System.out.println("Hello World"); 输出一个"Hello World"到屏幕
// ;代表语句的结束

public class Main {

    //编写一个 main 方法
    public static void main(String[] args) {
        String b1 = "西游记" ;
        String b2 = "红楼梦" ;
        System.out.println(b1 + b2 );

        char c1 = '西' ;
        char c2 = '游' ;
        char c3 = '记' ;
        System.out.println(c1 + c2 + c3);
        //保存两本书的价格
        double price1 = 123.56 ;
        double price2 = 321.11 ;
        System.out.println(price1 + price2);


        //作业4 使用不同的变量保存不同的变量数据，考察数据类型的差异
        System.out.println("homework4");

        //字符串，使用String类型
        String name = "姓名" ;
        String age = "年龄" ;
        String score = "成绩" ;
        String gender = "性别" ;
        String hobby = "兴趣" ;
        
        String name1 = "李子源" ;
        int age1 = 56 ;     //整数，使用int类型
        double score1 = 99.5 ; //小数，使用double类型  
        char gender1 = '男' ; //字符，使用char类型
        String hobby1 = "篮球" ; //字符串，使用String类型
        // \t 制表符，用于对齐 | \n 换行符，用于换行 
        System.out.println(name + "\t" + "\t" + age + "\t" + score + "\t" + gender + "\t" + hobby + "\n" + name1 + "\t" + "\t" + age1 + "\t" + "\t" + score1 + "\t" + gender1 + "\t" + "\t" + hobby1);
        

   // 使用char类型分别保存特殊字符和数字字符
        char ch1 = '\n';
        char ch2 = '\t';
        char ch3 = '\r';
        char ch4 = '\\';
        char ch5 = '1';
        char ch6 = '2';
        char ch7 = '3';

        // 打印输出这些字符
        System.out.println("ch1 = \\n : " + ch1);
        System.out.println("ch2 = \\t : " + ch2);
        System.out.println("ch3 = \\r : " + ch3);
        System.out.println("ch4 = \\\\ : " + ch4);
        System.out.println("ch5 = '1' : " + ch5);
        System.out.println("ch6 = '2' : " + ch6);
        System.out.println("ch7 = '3' : " + ch7);
        
        // 解释为什么转义字符输出看起来不同
        System.out.println("\n=== 转义字符输出解释 ===");
        System.out.println("1. \\n (换行符): 执行了换行操作，所以看不到字符，但产生了换行效果");
        System.out.println("2. \\t (制表符): 执行了制表操作，在控制台中显示为空格，但实际是制表符");
        System.out.println("3. \\r (回车符): 将光标移到行首，在控制台中可能看不到明显效果");
        System.out.println("4. \\\\ (反斜杠): 显示为可见的 \\ 字符");
        
        // 演示转义字符的实际效果
        System.out.println("\n=== 转义字符效果演示 ===");
        System.out.println("正常文本");
        System.out.println("包含\\n换行符的文本" + ch1 + "这是新的一行");
        System.out.println("包含\\t制表符的文本" + ch2 + "这是制表后的文本");
        System.out.println("包含\\\\反斜杠的文本" + ch4 + "这是反斜杠");

         // 作业5 使用boolean类型保存真假值，解释说明boolean类型
       System.out.println("homework5");

          // boolean类型只能取true或false，常用于条件判断
        boolean isPass = true;
        boolean isAdult = false;

        System.out.println("isPass（是否及格）: " + isPass);
        System.out.println("isAdult（是否成年）: " + isAdult);

        // 解释说明
        System.out.println("\n=== boolean类型说明 ===");
        System.out.println("boolean类型只有两个取值：true（真）和false（假），常用于判断条件。");
        System.out.println("例如：判断考试是否及格，isPass为true表示及格，false表示不及格。");
    }
    
    
}
```

---

## 进制与字面量

```java 
public class Main {

    //编写一个 main 方法
    public static void main(String[] args) {

        //演示各种进制
        int n1 = 0b1010;//2进制
        int n2 = 1010;//10进制
        int n3 = 01010;//8进制
        int n4 = 0x1010;//16进制
        System.out.println("n1=" + n1);
        System.out.println("n2=" + n2);
        System.out.println("n3=" + n3);
        System.out.println("n4=" + n4);


    }
}
```

### 进制的互相转换（输入 → 指定进制）

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        System.out.println("请输入原始进制 (2/8/10/16): ");
        int fromBase = sc.nextInt();
        if (fromBase != 2 && fromBase != 8 && fromBase != 10 && fromBase != 16) {
            System.out.println("不支持的进制");
            return;
        }
        System.out.println("请输入数字: ");
        String number = sc.next();
        System.out.println("请输入目标进制 (2/8/10/16): ");
        int toBase = sc.nextInt();

        // 先将原始数字转为十进制
        int decimalValue = Integer.parseInt(number, fromBase);
        String result = Integer.toString(decimalValue, toBase).toUpperCase();

        System.out.println("转换结果: " + result);
        sc.close();
    }
}
```

---

## 标识符规范

1. 字母，数字，$ _
2. 数字不可以开头，如 `int 3ab` 错误
3. 不可以使用关键字/保留字，但能包含
4. Java严格区分大小写，长度无限制，如 `int totalNum=10;`
5. 包名小写用 . 隔开
6. 关键字（略）



# 运算符

## 算术运算符

![image-20250829231917711](D:\Typora\TyporaPics\image-20250829231917711.png)

```java
public class Main {

    public static void main(String[] args) {
        // double 的除法会保留小数
        System.out.println("10/4");
        double c1,c2 ;
        c1 = 10 / 4 ; // int除法，结果2，再赋给double是2.0
        System.out.println(c1);
        c2 = (double)10 / 4 ; // 强转得到2.5
        System.out.println(c2);

        System.out.println(10%3);   // 1
        System.out.println(-10%3);  // -1 （符号与被除数相同）
        System.out.println(10%-3);  // 1
        System.out.println(-10%-3); // -1

        // 自增自减
        int i = 10 ;
        ++i; // 先加后用
        System.out.println("i="+i); // 11
        int j = 20 ;
        int k=j++; // 先用后加
        System.out.println("k="+k); // 20
        System.out.println("j="+j); // 21

        int i1 = 10 ;
        int i2 = 20 ;
        int i3 = i1++;
        System.out.println("i="+i);  
        System.out.println("i2="+i2);
        i3 = --i2;
        System.out.println("i3="+i3);
        System.out.println("i2="+i2);
    }
}
```

---

## 关系运算符

- 结果均为 boolean 型
- 常用于 if 条件或循环条件
- `==` 与 `=` 不同，注意区分

```java
public class Main {
    public static void main(String[] args) {
        int a = 9 ;
        int b = 8 ;
        System.out.println(a>b);  // true
        System.out.println(a>=b); // true
        System.out.println(a<=b); // false
        System.out.println(a<b);  // false
        System.out.println(a==b); // false
        System.out.println(a!=b); // true
        boolean flag = a > b;
        System.out.println(flag); // true
    }
}
```

---

## 逻辑运算符

- `&` 逻辑与（不短路）
- `&&` 短路与
- `|` 逻辑或（不短路）
- `||` 短路或
- `^` 逻辑异或
- `!` 逻辑非

```java
public class Main {
    public static void main(String[] args) {
        int age = 50 ;
        if(age > 20 && age < 90){
            System.out.println("age 的值为：" + age);
        }
        if(age > 20 & age < 90){
            System.out.println("age 的值为：" + age);
        }

        int c = 4;
        int d = 9;
        if(c < 1 && ++d < 50) { // 短路与：前假后不判断
        }
        System.out.println("c 的值为：" + c);
        System.out.println("d 的值为：" + d);

        int e = 4;
        int f = 9;
        if(e < 1 || ++f < 50) { // 短路或：前假，后为真
            System.out.println("e 的值为：" + e);
        }
        System.out.println("e 的值为：" + e);
        System.out.println("f 的值为：" + f);

        int g = 4;
        if(!(g < 1)) { // 逻辑非
            System.out.println("g 的值为：" + g);
        }
        System.out.println("g 的值为：" + g);

        int h = 4;
        int i = 9;
        if(h < 1 ^ ++i < 50) { // 逻辑异或：仅一个为真
            System.out.println("h 的值为：" + h);
        }
        System.out.println("h 的值为：" + h);
        System.out.println("i 的值为：" + i);
    }
}
```

---

## 赋值与三元运算符

```java
public class Main {
    public static void main(String[] args) {
        // 赋值运算符
        int n1= 10 , n2 = 4;
        n1 += 2; // 12
        System.out.println(n1);
        n2 /= 2; // 2
        System.out.println(n2);

        // 复合赋值会进行自动类型转换
        byte b = 1;
        b += 2; // 等价于 b = (byte)(b + 2);
        System.out.println(b); // 3
        b++; 
        System.out.println(b); // 4

        // 三元运算符
        int a = 10;
        int b1 = 99;
        int c = a > b1 ? a : b1;
        System.out.println(c); // 99
    }
}
```

---

## 运算符优先级与示例

```java
public class Main {
    public static void main(String[] args) {
        int a=3;
        int b=8;
        int c = (int) (a > b ? 1.1 : 2.2); // 强制转换
        System.out.println(c); // 2

        if (a > b) {
            System.out.println(100);
        } else {
            System.out.println(200);
        }

        int d = 3;
        int e = 8;
        int f = d > e ? 100 : 200;
        System.out.println(f); // 200

        // 三个数的最大值（两步 + 一步）
        int num1 = 10;
        int num2 = 20;
        int num3 = 30;
        int max1 = num1 > num2 ? num1 : num2;
        int max2 = max1 > num3 ? max1 : num3;
        System.out.println(max2); // 30

        int max = (num1 > num2 ? num1 : num2) > num3 
                ? (num1 > num2 ? num1 : num2) : num3;
        System.out.println(max); // 30
    }
}
```





# 控制结构（分支、循环、跳转）

## 键盘输入：Scanner

```java
import java.util.Scanner; // 1. 声明要使用Scanner工具

public class Main {
    public static void main(String[] args) {
        Scanner myScanner = new Scanner(System.in); // 2. 创建扫描器
        System.out.println("请输入薪水");
        double a = myScanner.nextDouble(); // 3. 使用扫描器读取输入
        System.out.println(a);
        myScanner.close(); // 4. 关闭扫描器，释放资源
    }
}
```

---

## 分支控制 if / else / switch

- 当条件表达式为 true 时执行大括号内代码
- 大括号中只有一条语句可省略，但建议保留

### if 单分支 与 if-else 双分支

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner ageScanner = new Scanner(System.in);
        System.out.println("请输入年龄");
        int age=ageScanner.nextInt();
        if (age >= 18 ) {
            System.out.println("你已经成年,可以进网吧嗨皮");
        } else {
            System.out.println("你还未成年,不能进网吧");
        }
        ageScanner.close();
    }
}
```

#### 例：能被3和5整除

```java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;
        int c = a + b ;
        if (c %5==0 && c%3 == 0) {
            System.out.println("可以被5和3整除");
        }else{
            System.out.println("不可以被5和3整除");
        }
    }
}
```

#### 例：闰年判断

```java
public class Main {
    public static void main(String[] args) {
        int year = 2015 ;
        if (year %4 == 0 && year % 100 !=0 || year % 400 == 0){
            System.out.println("是闰年");
        }else {
            System.out.println("不是闰年");
        }
    }
}
```

### else-if 多分支 与 if-if 嵌套

```java
public class Main {
    public static void main(String[] args) {
        double x = 11;
        double y = 19;
        if(x > 10.0 && y < 20.0){
            System.out.println("the sum=12 + 19 is:" + x+y);
        }
    }
}
```

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner myScanner = new Scanner(System.in);
        System.out.println("Enter the score");
        double score = myScanner.nextDouble();
        if (score > 8.0) {
            System.out.println("Enter the gender");
            char gender = myScanner.next().charAt(0);
            if (gender == 'M') {
                System.out.println("Enter the final of Male");
            } else if (gender == 'F') {
                System.out.println("Enter the final of Female");
            } else {
                System.out.println("Error");
            }
        } else {
            System.out.println("You are not eligible for the final");
        }
    }
}
```

### switch case 分支

- 表达式类型需与 case 常量一致，或可自动转换
- 支持：byte, short, int, char, enum, String
- `default` 可选

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner myScanner = new Scanner(System.in);
        System.out.println("请输入字母:");
        char letter = myScanner.next().charAt(0);
        switch(letter){
          case 'a':
            System.out.println("星期一");
            break;
          case 'b':
            System.out.println("星期二");
            break;
          case 'c':
            System.out.println("星期三");
            break;
          case 'd':
            System.out.println("星期四");
            break;
          case 'e':
            System.out.println("星期五");
            break;
          case 'f':
            System.out.println("星期六");
            break;
          case 'g':
            System.out.println("星期日");
            break;
          default:
            System.out.println("星期八 你脑子锈了");
            break;
        }
        myScanner.close();
        System.out.println("退出了程序，继续执行代码");
    }
}
```

#### 例：分数合格与否

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner myScanner = new Scanner(System.in);
        System.out.println("输入分数:");
        double score = myScanner.nextDouble();
        if (score >= 0 && score <= 100) {
            switch ((int) score / 60) {
                case 1:
                    System.out.println("及格");
                    break;
                case 0:
                    System.out.println("不及格");
                    break;
            }
        } else {
            System.out.println("输入的分数不合法");
        }
        myScanner.close();
    }
}
```

#### 例：输入数字得到季节（穿透）

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner myScanner = new Scanner(System.in);
        System.out.println("输入Season:");
        int season = myScanner.nextInt();
        if (season >= 0 && season <= 12) {
            switch (season) {
                case 3:
                case 4:
                case 5:
                    System.out.println("春");
                    break;
                case 6:
                case 7:
                case 8:
                    System.out.println("夏");
                    break;
                case 9:
                case 10:
                case 11:
                    System.out.println("秋");
                    break;
                case 12:
                case 1:
                case 2:
                    System.out.println("冬");
                    break;
                default:
                    System.out.println("输入的Season不合法");
                    break;
            }
            myScanner.close();
        }
    }
}
```

---

## 循环控制 for / while / do-while

### for 基础

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 100; i++) {
            if (i % 3 == 0) {
                System.out.println(i);
            }
        }
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println("i=" + i);
        }
        int j = 1;
        for (; j <= 10;) {
            System.out.println("j=" + j);
            j++;
        }
        int count = 3;
        int y = 0;
        for (int x = 0; x < count; x++,y+=2) {
            System.out.println("x=" + x + " y=" + y);
        }
    }
}
```

#### 例：统计1-100中能被9整除的个数与总和

```java
public class Main {
    public static void main(String[] args) {
        int i = 1;
        int j = 0;
        int count = 0;
        for (; i <= 100; i++) {
            if (i % 9 == 0) {
                count += i;
                j++;
            }
        }
        System.out.println("个数:" + j);
        System.out.println(count);

        int x = 0;
        int y = 5;
        for (; x <= 5; x++, y--) {
            System.out.println(x + "+" + y + "=" + 5);
        }
    }
}
```

### for-for 多层嵌套

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 3; j++) {
                System.out.println("i = " + i + " j = " + j);
            }
        }
    }
}
```

#### 例：三班各5人的平均分、总分、及格人数

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scoreScanner = new Scanner(System.in);
        double totalScore = 0;
        double sumGood = 0;
        for (int i = 1; i <= 3; i++) {
            double sum = 0;
            for (int j = 1; j <= 5; j++) {
                System.out.println("请输入第" + i + "班第" + j + "个学生的成绩");
                double score = scoreScanner.nextDouble();
                if (score >= 60 && score <= 100) {
                    sumGood += 1;
                }
                sum += score;
                totalScore += sum;
            }
            System.out.println(i + "班的平均分为" + (sum / 5) + "   总分为：" + sum + "\n");
        }
        System.out.println("所有班级的平均分为" + (totalScore / 15) + "   总分为：" + totalScore + "\n");
        System.out.println("及格人数为：" + sumGood + "\n");
        scoreScanner.close();
    }
}
```

#### 例：九九乘法表

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                int sum = i * j;
                System.out.print(j + "*" + i + "=" + sum + "\t");
            }
            System.out.println();
        }
    }
}
```

#### 例：空心金字塔 + 倒立空心金字塔

```java
public class Main {
    public static void main(String[] args) {
        int totalLevel = 5;
        for (int i = 1; i <= totalLevel; i++) {
            for (int s = 1; s <= totalLevel - i; s++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= 2 * i - 1; j++) {
                if (j == 1 || j == 2 * i - 1) {
                    System.out.print("*");
                } else {
                    System.out.print(" ");
                }
            }
            System.out.println();
        }
        for (int i = 1; i <= totalLevel; i++) {
            for (int s = 1; s <= i - 1; s++) {
                System.out.print(" ");
            }
            int charCount = 2 * (totalLevel - i + 1) - 1;
            for (int j = 1; j <= charCount; j++) {
                if (j == 1 || j == charCount) {
                    System.out.print("*");
                } else {
                    System.out.print(" ");
                }
            }
            System.out.println();
        }
    }
}
```

---

## while 与 do-while

```java
// while：先判断再执行
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}

// do-while：先执行再判断
int k = 1;
do {
    System.out.println(k);
    k++;
} while (k <= 5);
```

---

## 跳转控制 break / continue / return

### break：中止当前循环

```java
public class Main {
    public static void main(String[] args) {
        int j = 1;
        for (int i = 1; i <= 100; i++) {
            j += i;
            if (j > 20) {
                break;
            }
        }
        System.out.println("第一次大于20的当前数为" + j);
    }
}
```

### 登录系统（break跳出标号循环）

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        int maxChance = 3;
        int chance = 3;
        Scanner loginScanner = new Scanner(System.in);
        abc: for (int i = 1; i <= maxChance; i++) {
            System.out.println("请输入用户名");
            String username = loginScanner.next();
            System.out.println("请输入密码");
            String password = loginScanner.next();
            if ("丁真".equals(username) && "666".equals(password)) {
                System.out.println("登录成功");
                break abc;
            } else {
                chance--;
                System.out.println("登录失败,还有" + chance + "次机会");
            }
        }
    }
}
```

### continue：跳过本次，继续下一次

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            if (i == 3) {
                System.out.println("那里会有i，因为continue只是插曲，并且继续了故事，i = " + i);
                continue;
            }
            System.out.println("那里有i，i = " + i);
        }
    }
}
```

### return：结束整个方法

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("故事开始...");
        for (int i = 0; i < 5; i++) {
            if (i == 3) {
                System.out.println("那里不会再有i了，i = " + i);
                return;
            }
            System.out.println("那里有i，i = " + i);
        }
    }
}
```

### 同一循环对比 break/continue/return

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("故事开始...");
        for (int i = 0; i < 5; i++) {
            if (i == 3) {
                System.out.println("那里不会再有i了，因为break中止了故事，i = " + i);
                break;
            }
            System.out.println("那里有i，i = " + i);
        }

        System.out.println("故事开始...");
        for (int i = 0; i < 5; i++) {
            if (i == 3) {
                System.out.println("那里会有i，因为continue只是插曲，并且继续了故事，i = " + i);
                continue;
            }
            System.out.println("那里有i，i = " + i);
        }

        System.out.println("故事开始...");
        for (int i = 0; i < 5; i++) {
            if (i == 3) {
                System.out.println("那里不会再有i了，因为return将后续的故事退回不再讲述，i = " + i);
                return;
            }
            System.out.println("那里有i，i = " + i);
        }
    }
}
```





# 类`Class`与对象`Object`



## 类 与 对象的基本使用



```java
public class MainNew {
    public static void main(String[] args) {

        // 创建一个猫对象
        cat sWhite = new cat();

        sWhite.name = "小白"; // 给猫对象的name属性赋值
        sWhite.age = 1; // 给猫对象的age属性赋值
        sWhite.color = "白色"; // 给猫对象的color属性赋值

        System.out.println(sWhite.name + " " + sWhite.age + " " + sWhite.color);

    }
}

// 创建一个猫类
class cat {

    String name; // 定义猫对象的name属性
    int age; // 定义猫对象的age属性
    String color; // 定义猫对象的color属性
}
```





## 属性概念



1. 从概念和叫法上来看

​	`成员变量`=`属性`=`field`

​	即成员变量是用来表示属性的，授课中，统一叫属性

2. 属性是类的一个组成部分，一般使用基本数据类型，也可以是引用对象（对象，数组）。

## 属性细节



1. 属性的定义语法同变量，示例:访问修饰符 属性类型 属性名;
   1. 访问修饰符: 控制属性的访问范围有四种访问修饰符 public, proctected,默认,private
2. 属性的定义类型可以为任意类型，包含基本类型或引用类型
3. 属性如果不赋值，有默认值，规则和数组一致。
   1. 具体说:`int0` `short0` `byte0` `long0` `float0.0` `double0.0` `char\u0000` `booleanfalse` `Stringnull`

```java
public class MainNew {
    public static void main(String[] args) {

        // 创建一个猫对象
        cat sWhite = new cat();

        sWhite.name = "小白"; // 给猫对象的name属性赋值
        sWhite.age = 1; // 给猫对象的age属性赋值
        sWhite.color = "白色"; // 给猫对象的color属性赋值

        System.out.println(sWhite.name + " " + sWhite.age + " " + sWhite.color);
        System.out.println(sWhite.sal + " " + sWhite.isMale);
    }
}

// 创建一个猫类
class cat {

    String name; // 定义猫对象的name属性
    int age; // 定义猫对象的age属性
    String color; // 定义猫对象的color属性
    double sal;
    boolean isMale;
}

```







## 创建对象访问机制



**如何创建对象：**

1. 先声明再创建

`Cat cat;`

`cat = new Cat()`

1. 直接创建

​	`Cat cat = new Cat()`



## 如何访问对象



对象名.属性名

`cat.name;`

`cat.age;`



## 类和对象分配机制



### 对象分配机制



对象的分配机制，实际上是引用，如a已经声明了一个类，b = a；的话，b是引用于a 共用一个地址

```java
public class MainNew {
    public static void main(String[] args) {

        Person p1 = new Person();
        p1.age = 10;
        p1.name = "小明";
        Person p2 = p1;// 把p1 赋给了 p2，让p2指向p1
        p1.age = 80;
        System.out.println(p2.age);// p2和p1指向同一个对象，所以p2.age=80
    }
}

// 创建一个Person类
class Person {
    String name;
    int age;

}

```





1. 先加载Person类信息，只会加载一次
2. 在堆中分配空间，进行默认初始化
3. 把地址赋给p，p就指向对象
4. 进行指定初始化，例如 `p1.age = 10;`





## 类 与 对象 的关系示意图



![类与对象关系示意图](D:\Typora\TyporaPics\image-20250907202856242.png)





## JVM的内存分析代码执行流程





![image-20250907201933591](D:\Typora\TyporaPics\image-20250907201933591.png)







## 方法



 方法是在**类**中定义的方法，可以被main类调用`p1.speak`



## 方法的基本使用





![image-20250913203047243](D:\Typora\TyporaPics\image-20250913203047243.png)



![image-20250913204241178](D:\Typora\TyporaPics\image-20250913204241178.png)



```java
public class MainNew {
	public static void main(String[] args) {

		System.out.println(" ");
		Person p1 = new Person();
		int x = 1;
		p1.name = "小明";
		// 方法写好后如果不调用，那么方法就不会执行
//		p1.speak();  让猫说话
//		p1.cal01();
//		p1.cal02(5);// 调用cal02方法，传入参数5
//		p1.cal03(1, 2); //调用cal03 方法，传入参数1,2
//		int returnRes = p1.getSum(3, 6);//调用getSum方法，同时a=3,b=6,  把getSum返回的值，赋值给returnRes
//		System.out.println("getSum返回的值是:" + returnRes);

		int[] res = p1.getSumAndSub(2, 2);  //调用参数要和传入数据类型相同 如int ，后面是2
		System.out.println("sum= " + res[0] + "\nsub= " + res[1]);

		byte b1= 1 ;
		byte b2= 2 ;
		p1.getSumAndSub(b1,b2);
//		p1.getSumAndSub(1.1,1.8); 不可以把高精度的转移到低精度的
//		p1.getSumAndSub(1000); 传参个数不一致

		p1.f3("hello",1);
//		p1.f3(1,"1");   传参形式不兼容
	}


}

// 创建一个猫类
class Person {
	String name;

	public void speak() {
		System.out.println(name + " hello");
	}





	public void f3(String str,int n ){

	}

	public void f5(){
		//public void f7
		//方法里不能套方法
	}



	public void cal01() {

		int sum = 0;
		for (int i = 0; i <= 100; i++) {
			sum += i;
		}
		System.out.println("cal01 " + sum);
	}

	// int n 形参列表 表示当前有一个形参，可以接收用户输入
	public void cal02(int n) {
		int sum = 0;
		for (int i = 0; i <= n; i++) {
			sum += i;
		}
		System.out.println("cal02 " + sum);
	}


	//计算两个数的和
	//现在有两个形参，可以接收用户传入的两个参数
	public void cal03(int a, int b) {
		System.out.println("cal03 " + (a + b));
	}

	public int getSum(int a, int b) {
		int sum = a + b;
		return sum;
	}

	public int[] getSumAndSub(int n1, int n2) {

		int[] resArr = new int[2];
		resArr[0] = n1 + n2;
		resArr[1] = n1 - n2;
		return resArr;


	}

	public double f1(){
		double d1=1.1*3;
		int n = 1;
		return n;   //int可以转换成double类型，但double不能转换成int类型，因为精度会缺失
	}

	public void f2(){
		System.out.printf("HelloWorld!");
		System.out.printf("HelloWorld!");
		System.out.printf("HelloWorld!");

	}

}

```





跨类的方法调用需要通过对象名调用

同个类中方法可以直接调用

```java
public class MainNew {
	public static void main(String[] args) {

		System.out.println(" ");
		A a = new A();
		a.Sayok();

		a.m1();
	}



}

class A{
	public void print(int n ){
		System.out.println("print方法n被调用");
	}
	public void Sayok(){  //sayok 中调用print直接调用即可不用创建
		print(10);
		System.out.println("继续执行CayOK");
	}

	//跨类的方法调用需要通过对象名调用
	public void m1(){
		System.out.println("被调用");
		B b = new B();
		b.hi();
		System.out.println("继续被执行");
	}
}


class B{

	public void hi(){

		System.out.println("B被执行");
	}

}
```



## 成员方法

类定义的完善



```java
class 类名{

属性（成员变量）；

成员方法

}
```





比较简单的类和方法的使用练习

```java
public class MainNew {
	public static void main(String[] args) {

		System.out.println(" ");
		AA a= new AA();

//		if(a.isOdd(1)){ //T,这样的写法以后会看到很多，将boolean值直接交给if，如果是false直接跳到else中
//			System.out.println("是奇数");
//		}else {
//			System.out.println("是偶数");
//		}

		//使用print方法
		a.print(4,4,'#');

	}
}
class AA{
	//思路
	//1. 方法的返回类型 boolean
	//2. 方法的名字 isOdd
	//3. 方法的形参 (int num)
	//4. 方法体,judge
	public boolean isOdd(int num){

//		if(num % 2 !=0) {
//			return true;
//		}else {
//			return false;
//		}

//		return num % 2 !=0 ? true; false;
		return num % 2 !=0;
	}

	/*
	####
	####
	####
	####
	 */

	//思路
	//1. 方法的返回类型 void
	//2. 方法的名字 print
	//3. 方法的形参 (int row，int column,char c)
	//4. 方法体,for
	public void print(int row,int col,char c){
		for(int i = 0;i<row;i++){
			for(int j = 0;j<col;j++){//输出每一行
				System.out.print((c));
			}
			System.out.println();
		}
	}
}

```



### 成员方法传参机制

形参的任何改变 不影响实参 

```java
public class MainNew {
	public static void main(String[] args) {

		System.out.println(" ");


		int a = 10;
		int b = 20;

		A o = new A();
		o.swap(a,b);

		//调用完毕，形参ab已经销毁，所以sout中的ab已经变回10 20；
		System.out.println("\na="+a +',' + "\nb="+b);

	}

}
class A{
	public void swap(int a,int b) {
		System.out.println( "a和b交换前的值" +    "\na="+a +',' + "\nb="+b);
		int t =  a;
		a=b;
		b=t;
		System.out.println( "a和b交换后的值" +    "\na="+a +',' + "\nb="+b);

	}
}

```



但`数组Arr[]`和`字符串String`是引用，其来自同一个内存地址，所以会随着方法的引用而改变。



```java
public class MainNew {
	public static void main(String[] args) {

		System.out.println(" ");

		// int[] arr = {1, 2, 3};

		// System.out.println("Origin's array");
		// for (int i=0 ;i<arr.length;i++){
		// System.out.print(arr[i]+"\t");
		// }
		// System.out.println();
		B b=new B();
		// b.test100(arr);

		// System.out.println("Main's array");

		// for (int i=0 ;i<arr.length;i++){
		// System.out.print(arr[i]+"\t");
		// }
		// System.out.println();

		Person p = new Person();
		p.name = "jackie";
		p.age = 10;

		b.test200(p);
		System.out.println("年龄是"+p.age);
	}
}

class Person {
	String name;
	int age;

}

class B {

	public void test200(Person p) {
	p.age = 9999;

	}
	// test100,可以接收数组，在方法中修改数组，看看原来的数组是否变化
	public void test100(int[] arr) {
		arr[0] = 100;
		// 遍历数组
		System.out.println("Test100's array");

		for (int i = 0; i < arr.length; i++) {
			System.out.print(arr[i] + "\t");
		}
		System.out.println();

	}


	// test200,可以接收Person(age,sal)对象，在方法中修改该对象属性，
	// 看看原来的对象是否变化

}

```





copyPerson对象



```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");

		Person p = new Person();
		p.name = "milan";
		p.age = 30;

		MyTools tools = new MyTools();
		Person p2 = tools.copyPerson(p);

		// p and p2 are two independent objects
		System.out.println("p properties: age: " + p.age + ", name: " + p.name);
		System.out.println("p2 properties: age: " + p2.age + ", name: " + p2.name);
	}
}

class Person {
	String name;
	int age;
}

class MyTools {
	public Person copyPerson(Person p) {
		// create a new object
		Person p2 = new Person();
		p2.name = p.name; // copy name from p
		p2.age = p.age; // copy age from p
		return p2;
	}
}


```







# 递归 



**方法递归调用**
**递归重要规则**

1. 执行一个方法时，就创建一个新的受保护的独立空间(栈空间)

2. 方法的局部变量是独立的，不会相互影响，比如n变量
3. 如果方法中使用的是引用类型变量(比如数组)，就会共享该引用类型的数据。
4. **递归必须向退出递归的条件逼近，否则就是无限递归,出现`StackOverflowError`，死龟了:)**
5. 当一个方法执行完毕，或者遇到return，就会返回，遵守谁调用，就将结果返回给谁，同时当方法执行完毕或者返回时，该方法也就执行完毕。



**关键理解点**：

- `System.out.println("n="+n)`位于递归调用`test(n-1)`之后
- 这意味着**先完成所有递归调用**，然后**从最深层的递归开始逐层返回并执行打印**
- 因此打印顺序是递归返回的顺序：2（最深层）→3→4

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");

		T t = new T();
		t.test(4);
	}
}

class T {

	public void test(int n) {

		if (n > 2) {
			test(n - 1);

		}
		System.out.println("n=" + n);
	}

}

```





````markdown
当`t.test(4)`被调用时：

1. **n=4**: 4>2为true，调用`test(3)`，但此时**print语句还未执行**
2. **n=3**: 3>2为true，调用`test(2)`，print语句仍未执行
3. **n=2**: 2>2为false，跳过if语句，**执行`System.out.println("n="+2)`** → 输出"2"
4. **递归返回**: 回到n=3的调用点，继续执行后面的`System.out.println("n="+3)` → 输出"3"
5. **递归返回**: 回到n=4的调用点，继续执行后面的`System.out.println("n="+4)` → 输出"4"

**关键理解点**：
- `System.out.println("n="+n)`位于递归调用`test(n-1)`之后
- 这意味着**先完成所有递归调用**，然后**从最深层的递归开始逐层返回并执行打印**
- 因此打印顺序是递归返回的顺序：2（最深层）→3→4

如果代码改为：
```java
System.out.println("n="+n);  // 先打印
if (n > 2) {
    test(n-1);  // 后递归
}
```
那么输出就会是4、3、2的顺序。
````



若将`System.out.println("n="+n);`置于if后新加的else，则只有n=2



## 阶乘



```java

public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");

		// 阶乘使用
        T t = new T();
		int res = t.factorial(5);
		System.out.println("res=" + res);

	}
}

class T {


	public int factorial(int n) {// 阶乘
		if (n == 1) {
			return 1;

		} else {
			return factorial(n - 1) * n;
		}
	}

}

```



```powershell
res=120
```



![阶乘的内存分析](D:\Typora\TyporaPics\image-20251030110838645.png)



## 斐波那契数列



**请使用递归的方式求出斐波那契数1,1,2,3,5,8,13..给你一个整数n，求出它的值**

分析：

n= 1 1+0=1

n= 2 1+0=1

n= 3 1+1=2

n= 4 1+2=3

n= 5 2+3=5

...

算法为

n=(n-2) + (n-1)







```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");

		// 使用斐波那契数列方法
		T t = new T();
		int res = t.test(5);
		System.out.println("斐波那契数列为" + res);
	}
}

class T {

	public int test(int n) { // 斐波那契数列方法

		if (n >= 1) {
			if (n == 1 || n == 2) {
				return 1;
			} else {
				return test(n - 1) + test(n - 2);
			}
		} else {

			System.out.println("要求输入n>1的数");
			return -1;
		}

		/*
		 * 分析：
		 * n= 1 1+0=1
		 * n= 2 1+1=2
		 * n= 3 1+2=3
		 * n= 4 2+3=5
		 * n= 5 3+5=8
		 * 算法为
		 * n=(n-2) + (n-1)
		 */
	}

}

```



## 猴子吃桃





```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");
		System.out.println(" ");

		T t = new T();
	//使用猴子吃桃
		int day = -1;
		int peachNum = t.peach(day);
		if (peachNum != -1) {
			System.out.println("第" + day + "天的桃子数量：" + peachNum);
		}
		System.out.println("");
	}
}

class T {

	public int peach(int day) { //猴子吃桃方法

		if (day == 10) {
			return 1;
		} else if (day >= 1 && day <= 9) {
			return (peach(day + 1) + 1) * 2;
		} else {
			System.out.println("day在1-10之间");
			return -1;
		}
		/*
		 * 分析：
		 * 猴子吃桃子问题:有一堆桃子 N，猴子第一天吃了其中的一半 M=N/2，
		 * 并再多吃了一个以后每天猴子都吃其中的一半M/2，然后再多吃一个-1。
		 * 当到第10天时，想再吃时(即还没吃)，发现只有1个桃子了。
		 * 问题:最初共多少个桃子?
		 * day 10 ,peach10 = 1
		 * day 9 , peach9 = peach10+1 * 2 = 4
		 * day 8 , peach8 = peach9+1 * 2 = 10
		 * day n , peachN = peachN+1 * 2
		 * 前一天的桃子 = （后一天的桃子+1）*2
		 * 递归
		 */

	}

}

```



## 老鼠走迷宫



```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		T t = new T();

		/*
		 * 思路：
		 * 创建迷宫，用二维数组表示，int[][]map=new int[8][7]
		 * 规定map数组的元素值，0表示可以走的路，1表示障碍物。
		 */
		int[][] map = new int[8][7];
		/* 将最上面的一行，和最下面的一行，全部设置为1 */
		for (int i = 0; i < 7; i++) {
			map[0][i] = 1;
			map[7][i] = 1;

		}

		/* 将最右面的一列和最左面的一列，全部设置为1 */

		for (int i = 0; i < 8; i++) {
			map[i][0] = 1;
			map[i][6] = 1;
		}
		// 设置障碍
		map[3][1] = 1;
		map[3][2] = 1;
		map[2][2] = 1;

		// 输出当前的地图
		System.out.println("\n====当前地图情况====");
		for (int i = 0; i < map.length; i++) {
			for (int j = 0; j < map[i].length; j++) {
				System.out.print(map[i][j] + " ");// 输出一行
			}
			System.out.println();
		}

		// 使用findWay给老鼠找路
		T t1 = new T();

		t1.findWay(map, 1, 1);
		// 输出当前的地图
		System.out.println("\n====找路的情况如下====");
		for (int i = 0; i < map.length; i++) {
			for (int j = 0; j < map[i].length; j++) {
				System.out.print(map[i][j] + " ");// 输出一行
			}
			System.out.println();
		}
	}
}

class T {
	/*
	 * use 递归回溯的思想解决老鼠出迷宫
	 * map是二维数组，即表示迷宫
	 * i,j 老鼠的位置，初始化为1,1
	 * 因为是递归的找路，所以要找到退出递归路径，规定map[][]各个值的含义
	 * 0表示可以走1表示障碍物，2可以走，3表示走过，但是是死路，
	 * 当map[6][5]=2表示找到通路，就可以结束递归，否则继续找
	 * 先确定老鼠找路的策略，⬇️➡️⬆️⬅️
	 */
	// 找出迷宫出口的路径findWay T找到 F没找到

	public boolean findWay(int[][] map, int i, int j) {

		if (map[6][5] == 2) {// 找到路
			return true;
		} else {
			if (map[i][j] == 0) {// 当前位置为0,说明可以走，没走过
				// 我们假定可以走通，
				map[i][j] = 2;
				// 使用找路策略开始测试，来确定该点该位置是否真的可以走通，
				if (findWay(map, i + 1, j)) {// ⬇️
					return true;
				} else if (findWay(map, i, j + 1)) {// ➡️
					return true;
				} else if (findWay(map, i - 1, j)) {// ⬆️
					return true;
				} else if (findWay(map, i, j - 1)) {// ⬅️
					return true;
				} else {
					map[i][j] = 3;
					return false;
				}
			} else {// map[i][j]=1 or = 2 or = 3
				return false;
			}
		}
	}

	public boolean findWay2(int[][] map, int i, int j) {

		if (map[6][5] == 2) {// 找到路
			return true;
		} else {
			if (map[i][j] == 0) {// 当前位置为0,说明可以走，没走过
				// 我们假定可以走通，
				map[i][j] = 2;
				// 使用找路策略开始测试，来确定该点该位置是否真的可以走通，
				if (findWay2(map, i, j + 1)) {
					return true;
				} else if (findWay2(map, i + 1, j)) {
					return true;
				} else if (findWay2(map, i, j - 1)) {
					return true;
				} else if (findWay2(map, i - 1, j)) {
					return true;
				} else {
					map[i][j] = 3;
					return false;
				}
			} else {// map[i][j]=1 or = 2 or = 3
				return false;
			}
		}
	}

}

```



# 重载 OverLoad

Java中允许同一个类中，多个同名方法的存在，但要求形参列表不一致

比如sout out是printStream类型

如无重载

printlnt

printChar

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// Overload of Method
		//
		System.out.println(100);
		System.out.println("100");

	}
}

class Tower {

}

```



## 方法重载快速入门



```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// Overload of Method
		//
		// System.out.println(100);
		// System.out.println("100");

		// My calculator方法的调用
		// 可以根据传入类型自动匹配方法
		MyCalculator mc = new MyCalculator();
		System.out.println(mc.calculate(1, 2, 3));
	}
}

class MyCalculator {
	// 两个整数的和
	public int calculate(int n1, int n2) {
		return n1 + n2;
	}

	// 一个整数，一个double的和
	public double calculate(int n1, double n2) {
		return n1 + n2;
	}

	// 一个double，一个int的和
	public double calculate(double n2, int n1) {
		return n2 + n1;
	}

	// 三个int的和
	public int calculate(int n1, int n2, int n3) {
		System.out.println("三个int的和被调用");
		return n1 + n2 + n3;
	}

}

```



## 方法重载的注意细节



**方法重载就是同名不同参**

1. 方法名一定要相同
2. 形参列表必须不同
   1. 形参顺序不同
3. 返回类型无要求



## 方法重载的使用

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// Overload of Method
		//
		// System.out.println(100);
		// System.out.println("100");

		// My calculator方法的调用
		// 可以根据传入类型自动匹配方法
		Methods m = new Methods();
		m.m(2);
		m.m(3, 2);
		m.m('a');
	}
}

class Methods {

	public void m(int n) {
		System.out.println(n * n);
	}

	public void m(int n1, int n2) {
		System.out.println(n1 * n2);
	}

	public void m(char char1) {
		System.out.println(char1);
	}

}

```



```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// Overload of Method
		//
		// System.out.println(100);
		// System.out.println("100");

		// My calculator方法的调用
		// 可以根据传入类型自动匹配方法
		Methods m = new Methods();
		System.out.println(m.max(2, 3));
		System.out.println(m.max(2.1, 3.2));
		// 在方法的重载中优先使用匹配的数据类型，然后选择提升精度的类型。
		System.out.println(m.max(2.6, 3, 4.1));
		System.out.println(m.max(2.6, 3, 4));
	}
}

class Methods {

	public int max(int n1, int n2) {
		return n1 > n2 ? n1 : n2;
	}

	public double max(double n1, double n2) {

		return n1 > n2 ? n1 : n2;
	}

	public double max(double n1, double n2, double n3) {

		double max = n1 > n2 ? n1 : n2;
		return max > n3 ? max : n3;
	}

	public double max(double n3, double n4, int n5) {

		double max = n3 > n4 ? n3 : n4;
		return max > n5 ? max : n5;
	}

}

```





# 可变参数



Java允许将同一个类中多个同名同功能但参数个数不同的方法封装成一个方法，就可以通过可变参数实现



```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		Methods methods = new Methods();
		methods.sum(1, 5, 9, 6, 4, 1, 3);
		System.out.println(methods.sum(1, 5, 9, 6, 4, 1, 3));
	}
}

class Methods {

	// int...表示可以接收多个参数个数，类型是int，即可以接收多个int(0-n)
	// 使用可变参数时，可以当作数组来使用，即sums可以当作数组。
	// 遍历sums求和即可
	public int sum(int... sums) {
		System.out.println("数组sums的个数为：" + sums.length);
		int res = 0;
		for (int i = 0; i < sums.length; i++) {
			res += sums[i];
		}
		return res;
	}
}

```





## 可变参数的注意细节

1. 可变参数的实参可以为0个或任意多个。

2. 可变参数的实参可以为数组

3. 可变参数的本质就是数组

4. 可变参数可以和普通类型的参数一起放在形参列表，但必须保证可变参数在最后

   1. ```java
      	//可变参数必须在形参列表的最后
      	//错误示范：
      	//public int sum(int n1,int... sums,int n3) {
      	// 	System.out.println("数组sums的个数为：" + sums.length);
      	// 	int res = 0;
      	// 	for (int i = 0; i < sums.length; i++) {
      	// 		res += sums[i];
      	// 	}
      	// 	return res;
      	// }
      	
      ```

      

5. 一个形参列表中只能出现一个可变参数



**练习**

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		Methods methods = new Methods();

		System.out.println(methods.list("Jack", 1, 2, 3, 4, 5));

	}
}

class Methods {

	// int...表示可以接收多个参数个数，类型是int，即可以接收多个int(0-n)
	// 使用可变参数时，可以当作数组来使用，即sums可以当作数组。
	// 遍历sums求和即可
	public String list(String n1, double... sums) {

		int res = 0;
		for (int i = 0; i < sums.length; i++) {

			res += sums[i];
		}
		return n1 + "的总分是" + res;

	}

}

```





# 作用域



1. 在Java编程中，主要的变量就是属性（成员变量），和局部变量

2. 局部变量一般是指在成员方法中定义的变量

   1. ```java
      public class MainNew {
      	public static void main(String[] args) {
      		System.out.println(" ");
      		System.out.println(" ");
      
      		Methods methods = new Methods();
      
      		System.out.println(methods.list("Jack", 1, 2, 3, 4, 5));
      
      	}
      }
      
      class Methods {
      
      	// int...表示可以接收多个参数个数，类型是int，即可以接收多个int(0-n)
      	// 使用可变参数时，可以当作数组来使用，即sums可以当作数组。
      	// 遍历sums求和即可
      	public String list(String n1, double... sums) {
      
      		int res = 0;
      		for (int i = 0; i < sums.length; i++) {
      
      			res += sums[i];
      		}
      		return n1 + "的总分是" + res;
      
      	}
      
      }
      
      class Cat{
          //全局变量就是属性
          //属性在定义时，可以直接赋值
          int age = 10;
      	public void cry(){
      
      		int n = 10;
      		String name ="jack";
              System.out.println("在cry中使用属性age："+age);
      	}
          public void eat(){
              System.out.println("age="+age);
      		//不在作用域内。
      		//System.out.println("在eat中使用cry"+name);
          }
      }
      ```

   2. n和name就是局部变量

   3. n和name 的作用域在cry方法中

3. 全局变量/属性 可以不赋值，直接使用，局部变量必须在赋值之后才能使用因为没有赋值



## 注意事项

1. 属性和局部变量可以重名，访问时遵循就近原则。
2. 在同一个作用域中，两个局部变量不能重名。
3. 属性生命周期较长，伴随着对象创建而创建，死亡而死亡。局部变量生命周期较短，伴随着他的代码块而创建，结束而死亡，即再一次方法调用过程中。
4. 作用域范围不同
   1. 全局变量可以被本类使用，或其他类（调用）使用
   2. 局部变量只能在本类使用。





# 构造器/构造方法 （Constructor）

**完成对新对象的初始化**



```java

[修饰符] 方法名（形参列表）{

		方法体;

}


```



1. 构造器的修饰符可以默认 也可以是 ppp
2. 没有返回值
3. 方法名和类名要一样
4. 参数列表和成员方法一样的规则
5. 构造器的调用由系统完成

## 构造器的快速入门

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// 当new一个新对象时，直接通过构造器指定名字和年龄。
		Cat c = new Cat("哈基米", 18);
		Cat c2 = new Cat(31);
		System.out.println("c的信息如下：");
		System.out.println("c的名字：" + c.name);
		System.out.println("c的年龄：" + c2.age);
	}
}

class Cat {

	String name;
	int age;

	// 1. 构造器没有返回值，也不能写void
	// 2. 构造器的名称和类名Cat必须一样。
	// 3. (String cName,int cAge)是形参列表
	public Cat(String cName, int cAge) {
		System.out.println("构造器被调用，完成对象的初始化");
		name = cName;
		age = cAge;
	}

	public Cat(int cAge) {
		System.out.println("构造器被调用，完成对象Age的初始化");
		age = cAge;
	}
}
```



## 构造器的注意事项和细节

1. 一个类可以定义多个不同的构造器，即构造器的重载
   1. 创造构造器的时候只初始化人名，不初始化年龄。
2. 如果成员没有定义构造器，系统会自动给类生成一个默认无参构造器，Person(){}



练习

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// 当new一个新对象时，直接通过构造器指定名字和年龄。
		Person p = new Person();// 无参构造器
		// p.name = 对象.属性
		// p.name = 对象.属性
		// p.name = 对象.属性
		System.out.println("p1的信息 name=" + p.name);
		System.out.println("p1的信息 age=" + p.age);
		Person p2 = new Person("Frank", 30);// 无参构造器
		System.out.println("p2的信息 name=" + p2.name);
		System.out.println("p2的信息 age=" + p2.age);

	}
}

class Person {
	String name;
	int age;

	public Person() {
		age = 18;
	}

	public Person(String pName, int pAge) {
		age = pAge;
		name = pName;
	}
}

```

# This关键字

哪个对象调用，this就代表哪个对象



## This 关键字使用细节



1. this关键字可以用来访问本类的属性，方法，构造器
2. this用于区分当前类的属性和局部变量
3. 访问成员方法的语法 this.方法名（参数列表）
4. 访问构造器语法 this（参数列表）（只能在构造器中使用）只能在构造器中访问另外一个构造器
5. this不能在类定义的外部使用，只能在类定义的方法中使用



```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// T t1 = new T();
		// t1.f2();
		T t2;
		t2 = new T();
		T t1;
		t1 = new T();
		t1.f3();

	}
}

class T {
	String name = "jackie";

	/*
	 * Detail：
	 * 访问构造器语法 this（参数列表）（只能在构造器中使用）
	 * 只能在构造器中访问另外一个构造器
	 * Notice：
	 * 访问构造器语法：this(参数列表)
	 * 要放在第一条语句
	 */
	public T() {

		this("jack", 100);

		System.out.println("T()constructor");
		// 在这里去访问T(String name, int age)、
	}

	public T(String name, int age) {
		System.out.println("T(String name, int age)constructor");
	}

	// 访问成员方法的语法 this.方法名（参数列表）
	public void f1() {
		System.out.println("f1() method...");
	}

	public void f2() {
		System.out.println("f2() method...");
		// 调用本类的f1方法
		// 第一种方式
		f1();
		// 第二种方式
		this.f1();
	}

	public void f3() {
		String name = "Smith";
		// name就近原则，this.name准确定位到属性
		System.out.println("name: " + name);
		System.out.println("this.name: " + this.name);
	}
}
```





# 编程思维阶段练习



### 比较两个人是否相同

比较两个人是否相同

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		Person p1 = new Person("Mary", 20);
		Person p2 = new Person("Smith", 36);
		System.out.println(p1.compareTo(p2));
	}
}

class Person {
	String name;
	int age;

	// 这里错过，构造器必须和类名相同
	public Person(String name, int age) {
		this.name = name;
		this.age = age;
	}

	public boolean compareTo(Person p) {

		return this.name.equals(p.name) && this.age == p.age;
	}

}
```



### double数组的最大值

编写类A01，定义方法max，实现求某个double数组的最大值，并返回

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		/*
		 * 编写类A01，定义方法max，实现求某个double数组的最大值，并返回
		 * 1.class A01
		 * 2.public double max(double[]){}
		 * 3.return double;
		 * 新建对象m1,sout中调用m1.max;
		 */
		A01 m1 = new A01();
		double arr[] = { 1, 3, 5, 4, 944, 496, 4, 54 };
		Double res = m1.max(arr);
		if (res != null) {
			System.out.println("Max of arr = " + res);

		} else {
			System.out.println("Error");
		}
	}
}

class A01 {
	public Double max(double[] arr) {

		if (arr != null && arr.length > 0) {
			double max = arr[0];
			for (int i = 1; i < arr.length; i++) {
				if (max < arr.length) {
					max = arr[i];
				}
			}
			return max;
		} else {
			return null;
		}

	}
}
```

### find查找

编写类A02，定义方法find，实现查找某字符串数组中的元素查找，并返回索引如果找不到，返回-1

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		/*
		 * 编写类A02 定义方法find，
		 * 实现查找某字符串是否在数组中，并返回索引，
		 * 如果没有则返回-1
		 * equals(),
		 * for循环
		 * return .../-1;
		 */
		A02 finder = new A02();
		String arr[] = { "apple", "banana", "grape", };
		int index = finder.find(arr, "banana");
		System.out.println(index);
	}
}

class A02 {

	public int find(String[] arr, String fruit) {

		// 遍历
		for (int i = 0; i < arr.length; i++) {
			if (fruit.equals(arr[i])) {
				return i;
			}
		}
		return -1;
	}

}
```



### Book updatePrice

创建对象book

用构造器初始化book的两个属性name，price

然后用updatePrice方法，进行更改价格

最后用info输出，验证结果

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// 编写类Book，定义方法updatePrice，实现更改某本书的价格，
		// 具体:如果价格>150,则更改为150，如果价格>100,更改为100，
		// 否则不变
		// 提供一个构造器
		Book book = new Book("西游记", 20);
		book.info();
		book.updatePrice();// 更新价格
		book.info();
	}
}

class Book {
	double price;
	String name;

	public Book(String name, double price) {
		this.name = name;
		this.price = price;
	}

	public void updatePrice() {

		if (this.price >= 150) {
			this.price = 150;
		} else if (this.price > 100) {
			this.price = 100;
		}
	}

	public void info() {
		System.out.println("书名：" + this.name + "价格：" + this.price);
	}
}
```



### copyArrary新数组元素和旧数组相同

int一个旧数组arr1

定义A03类，创建copyArr方法，方法类型为int[] 数组的int类型

copyArr方法使用创建一个新数组，长度为arrOld.length

for循环遍历旧数组，并将旧数组的每一个元素赋值到新数组的每一个位置

即arrNew[i]=arrOld[i]

返回arrNew数组

新建copy对象

创建一个newArr数组，newArr数组等于

调用copy.copyArr方法

遍历arrNew进行验证。

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");
		/*
		 * 思路
		 * 输入一个旧数组
		 * 注意复制，因为数组是引用类型，所以需要遍历一边数组
		 * 把旧数组的内容遍历到新数组，即arrNew[i]=arrOld[i]
		 */
		int arr1[] = { 1, 3, 5, 9 };
		A03 copy = new A03();
		int[] newArr = copy.copyArr(arr1);

		// 遍历arrNew进行验证
		for (int i = 0; i < newArr.length; i++) {

			System.out.print(" " + newArr[i]);
		}
	}
}

class A03 {

	public int[] copyArr(int arrOld[]) {
		// 在堆中创建一个长度为arrOld.length的arrNew
		int[] arrNew = new int[arrOld.length];
		// 用for循环实现arrNew复制arrOld数组中的每一个元素i
		for (int i = 0; i < arrOld.length; i++) {
			arrNew[i] = arrOld[i];
		}
		return arrNew;
	}

}
```



### 圆类Circle

定义属性:半径，len方法，area方法

调用Math.PI

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		Circle a = new Circle(3);
		System.out.println("圆a的面积为：" + a.area());
		System.out.println("圆a的周长为：" + a.length());
	}
}

class Circle {

	double radius;

	public Circle(double radius) {
		this.radius = radius;
	}

	public double area() {// 面积
		return Math.PI * radius * radius;
	}

	public double length() {// 周长
		return Math.PI * radius * 2;
	}
}
```

### Cale计算类

定义四个方法实现求和、差、乘、商(要求除数为0的话，要提示)并创建两个对象，分别测试

单独讨论商

0不能作为除数

所以以往的double类型要有一个单独提示

即，用Double封装，可以返回null值，用null值做判断

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// 编程创建一个Cale计算类，在其中定义2个变量表示两个操作数，
		// 定义四个方法实现求和、差、乘、商(要求除数为0的话，要提示)

		Cale cal1 = new Cale(3, 0);
		System.out.println("1和=" + cal1.plus());
		System.out.println("1差=" + cal1.minus());
		System.out.println("1乘=" + cal1.multiply());

		if (cal1.divide() == null) {
			System.out.println("1被除数不能为0");
		} else {
			System.out.println("1商=" + cal1.divide());
		}

	}
}

class Cale {
	// 定义两个操作数
	double num1;
	double num2;

	// 构造器初始化对象
	public Cale(double num1, double num2) {
		this.num1 = num1;
		this.num2 = num2;
	}

	// 和
	public double plus() {
		return this.num1 + this.num2;
	}

	// 差
	public double minus() {
		return this.num1 - this.num2;
	}

	// 乘
	public double multiply() {
		return num1 * num2;
	}

	// 商(除数为0的话，要提示)
	public Double divide() {
		if (this.num2 == 0) {
			return null;
		}
		return this.num1 / this.num2;
	}

}
```



### Dog类，this属性

有名字、颜色和年龄属性，定义输出方法show()显示其信息。并创建对象，进行测试、【提示 this.属性 】



```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// 设计一个Dog类，有名字、颜色和年龄属性，
		// 定义输出方法show()显示其信息
		// 创建对象，进行测试
		Dog dog1 = new Dog("李文超大将军", '黄', 7);
		dog1.show();
	}
}

// 定义一个dog类
class Dog {
	// 创建属性
	String name;
	char color;
	int age;

	// 创建构造器初始化对象
	public Dog(String name, char color, int age) {
		this.name = name;
		this.color = color;
		this.age = age;
	}

	// 定义方法show()
	public void show() {
		System.out.println("此狗的信息为：");
		System.out.println("名字：" + this.name);
		System.out.println("花色：" + this.color);
		System.out.println("年龄：" + this.age);
	}

}
```

### 匿名对象

匿名对象只能用一次：new test1().count1()

![9f43becfe97dacc37683e73a48e08c98](D:\Typora\TyporaPics\9f43becfe97dacc37683e73a48e08c98.png)

![image-20251103134402030](D:\Typora\TyporaPics\image-20251103134402030.png)

### Music类

里面有音乐名name、音乐时长times属性，并有播放play功能和返回本身属性信息的功能方法

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		// 定义Music类，
		// 里面有音乐名name、音乐时长times属性，
		// 并有播放play()功能和返回本身属性信息的功能方法getInfo()
		Music m1 = new Music("只因你太美", 2.5);
		m1.play();
		System.out.println(m1.getInfo());
	}
}

class Music {
	String name;
	double times;

	public Music(String name, double times) {
		this.name = name;
		this.times = times;
	}

	public void play() {
		System.out.println("音乐" + this.name + "正在播放中，时长" + this.times + "年");
	}

	public String getInfo() {
		return "当前播放音乐为：" + this.name + "，时长共" + this.times + "年";
	}
}
```

### 10.![image-20251103135634621](D:\Typora\TyporaPics\image-20251103135634621.png)

### 11.![image-20251103140350645](D:\Typora\TyporaPics\image-20251103140350645.png)

### 12 复用构造器

创建一个Employee类，属性有(名字，性别，年龄，职位，薪水)，提供3个构造方法，可以初始化(1)(名字，性别，年龄，职位，薪水)，(2)(名字，性别，年龄)(3)(职位，薪水)，要求充分

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		/*
		 * 创建一个Employee类，属性有(名字，性别，年龄，职位，薪水)
		 * 提供3个构造方法，可以初始化
		 * (1)(名字，性别，年龄，职位，薪水)，
		 * (2)(名字，性别，年龄)
		 * (3)(职位，薪水)，
		 * 要求充分复用构造器
		 */
		Employee e1 = new Employee("蔡徐坤", '男', 20, "Singer", 1000000);
		Employee e2 = new Employee("蔡徐坤", '男', 20);
		Employee e3 = new Employee("Singer", 1000000);
	}
}

class Employee {
	String name;
	char gender;
	int age;
	String job;
	double salary;

	public Employee(String job, double salary) {
		this.job = job;
		this.salary = salary;
	}

	public Employee(String name, char gender, int age) {
		this.name = name;
		this.gender = gender;
		this.age = age;
	}

	public Employee(String name, char gender, int age, String job, double salary) {
		this(name, gender, age);
		this.job = job;
		this.salary = salary;
	}
}
```

### Circle 类 打印半径和面积times循环

包含一个 double 型的 radius 属性代表圆的半径，findArea() 方法返回圆的面积。定义一个类 PassObject，在类中定义一个方法 printAreas()，该方法的定义如下：public void printAreas(Circle c, int times)在 printAreas 方法中打印输出 1 到 times 之间的每个整数半径值，以及对应的面积。例如，times 为 5，则输出半径 1，2，3，4，5，以及对应的圆面积。在 main 方法中调用 printAreas() 方法，调用完毕后输出当前半径值。

输出结果为![image-20251103141826376](D:\Typora\TyporaPics\image-20251103141826376.png)

```java
public class MainNew {
	public static void main(String[] args) {
		System.out.println(" ");
		System.out.println(" ");

		Circle c1 = new Circle();
		PassObject p1 = new PassObject();

		p1.printAreas(c1, 5);

	}
}

// 定义一个 Circle 类，包含一个 double 型的 radius 属性代表圆的半径，
// findArea() 方法返回圆的面积。
class Circle {
	double radius;

	public Circle() {

	}

	public double findArea() {
		return Math.PI * this.radius * this.radius;
	}

	public void setRadius(double radius) {
		this.radius = radius;
	}
}

/*
 * 定义一个类 PassObject，在类中定义一个方法 printAreas()，
 * 该方法的定义如下：public void printAreas(Circle c, int times)
 * 在 printAreas 方法中打印输出 1 到 times 之间的每个整数半径值，
 * 以及对应的面积。
 * 例如，times 为 5，则输出半径 1，2，3，4，5，以及对应的圆面积。
 * 在 main 方法中调用 printAreas() 方法，调用完毕后输出当前半径值。
 */
class PassObject {
	/* 创建了一个Circle类中的c对象 */
	public void printAreas(Circle c, int times) {
		// 调用c对象

		System.out.println("Radius" + "\t" + "Areas");
		for (int i = 1; i <= times; i++) {
			// findArea的返回值就是Areas，其变量为radius
			c.setRadius(i);
			System.out.println((double) i + "\t" + c.findArea());

		}
	}
}
```

### 14 MoraGame猜拳游戏

思路

​    // Tom设计他的成员变量，成员方法，可以和电脑猜拳，电脑每次都会随机生成012,石头剪刀布，并要可以显示，tom的输赢次数。列一个清单

Tom猜拳，Scanner

Com猜拳，Random

compare判断输赢

count计数

```java
import java.util.Random;
import java.util.Scanner;

public class MainNew {
	public static void main(String[] args) {
		// 换行符
		System.out.println(" ");
		System.out.println(" ");

		int gameCount = 1;// 定义游戏局数，
		Random random = new Random();// 定义随机数random
		Scanner scanner = new Scanner(System.in);// 定义tom扫描器

		System.out.println("moraGame：");// 程序启动

		Scanner ifContinue = new Scanner(System.in);// 定义一个string扫描器
		Tom g1 = new Tom();// 输入参数

		while (true) {// 开始循环
			// 游戏开始
			System.out.println("新的回合开始了。");
			System.out.println("输入对应的数字和电脑进行猜拳：");
			System.out.println("石头：0\t剪刀：1\t布：2");

			int input = scanner.nextInt();// 等待用户输入

			if (input == 0 || input == 1 || input == 2) {// 判断输入数字是否有效

				if (input == 0) {// 翻译用户输入数字
					System.out.println("你出了石头");
				} else if (input == 1) {
					System.out.println("你出了剪刀");
				} else if (input == 2) {
					System.out.println("你出了布");
				}

				int comRan = random.nextInt(3);// 电脑随机数

				if (comRan == 0) {// 翻译电脑随机数
					System.out.println("电脑出了石头");
				} else if (comRan == 1) {
					System.out.println("电脑出了剪刀");
				} else if (comRan == 2) {
					System.out.println("电脑出了布");
				}

				g1.mora(input, comRan);// 运行游戏mora逻辑

				System.out.println("按Y继续游戏，或任意键结束");// 是否继续
				String ifContinuer = ifContinue.nextLine();// 输入参数

				if (ifContinuer.equals("Y")) {// 检查Y，
					gameCount++;// 成功的话gameCount对局数加1
					continue;// 继续循环程序。

				} else {// 结束，统计tom输赢次数
					System.out.println("游戏结束");
					System.out.println("一共游戏次数：" + gameCount);
					System.out.println("Tom赢得游戏次数为：" + g1.getWinCount());
					break;
				}

			} else {// 输入错误，关闭程序
				System.out.println("输入有误，moraGame终止。");
				break;
			}

		}
		// 关闭扫描器
		scanner.close();
		ifContinue.close();
	}
}

class Tom {
	// 定义属性
	int tomGuess;
	int comGuess;
	int winCount;

	public Tom() { // 构造器，初始化对象

	}

	public void mora(int tomGuess, int comGuess) { // 猜拳游戏核心部分
		// 更新参数
		this.tomGuess = tomGuess;
		this.comGuess = comGuess;

		if (tomGuess == 1 && comGuess == 0) { // 运行猜拳，条件，其中winCount用于增加游戏局数
			System.out.println("Win");
			winCount++;
		} else if (tomGuess == 2 && comGuess == 1) {
			System.out.println("Win");
			winCount++;
		} else if (tomGuess == 0 && comGuess == 2) {
			System.out.println("Win");
			winCount++;
		} else if (tomGuess == comGuess) {
			System.out.println("Draw");
		} else {
			System.out.println("Lose");
		}
	}

	public int getWinCount() { // 获取胜利数
		return winCount;
	}
}
```











# 包 Package

包的本质就是创建不同的文件夹保存类文件

```java
package com.use;

import com.xiaoqiang.Dog;//导入com.xiaoqiang.Dog类

public class Test {
	public static void main(String[] args) {
		Dog dog = new Dog();//默认使用com.xiaoqiang.Dog
		System.out.println(dog);
        
		com.xiaoming.Dog dog1 = new com.xiaoming.Dog();//特殊说明，使用com.xiaoming.Dog
		System.out.println(dog1);
		
	}

}

```

## 包的命名

### 命名规则

只能包含`数字`、`字母`、`下划线`、`小圆点`.,但不能用数字开头，不能是`关键字`或`保留字`
~~demo.class.exec1~~
~~demo.12a~~
**demo.ab12.oa** 

### 命名规范

一般是小写字母+小圆点一般是`com.公司名.项目名.业务模块名`

比如:`com.hspedu.oa.model`;`com.hspedu.oa.controller`;
举例:
com.sina.crm.user //用户模块
com.sina.crm.order // 订单模块
com.sina.crm.utils//工具类

### 常用的包

`java.lang.`基本包，不需要引入

java.lang. //lang包是基本包，默认引入，不需要再引入.

java.util. //util 包，系统提供的工具包,工具类，使用 Scanner

java.net. //网络包，网络开发//

java.awt. 是做java的界面开发，GUI


## 如何引入包


com.hspedu.pkg :lmport01.java

语法: import 包;我们引入一个包的主要目的是要使用该包下的类

比如 import java.util.Scanner;就只是引入一个类Scannerimport 

java.util.*;// 表示将 java.util 包所有都引入

案例: 使用系统提供 Arrays 完成 数组排序




### 注意事项和使用细节

`package `的作用是声明当前`类`所在的包,需要放在`类`的最上面，

一个`类`中最多只有一句`packageimport`指令

位置放在`package`的下面，在`类`定义前面,可以有多句且没有顺序要求。

```java
//要在第一行，一个类最多只有一个package
package com.jl.pkg;

//import指令 位置放在package的下面，在类定义前面,可以有多句且没有顺序要求

import java.sql.SQLOutput;
import java.util.Arrays;
import java.util.Scanner;

public class PkgDetail {
	public static void main(String[] args) {
		Scanner scanner1 = new Scanner(System.in);
		int[] arr = {0, -1, 1};
		Arrays.sort(arr);
		for (int i = 0; i < arr.length; i++) {
			System.out.print(arr[i] + "\t");
		}
	}
}

```

# 访问修饰符

java提供四种访问控制修饰符号控制方法和属性(成员变量)的访问权限(范围)

public 对外公开

protected 被保护 对子类和同一个包中的类公开

默认级别 没有修饰符号 向同一个包的类公开

private 私有 只有类本身可以访问，不公开.



![image-20251104012159884](D:\Typora\TyporaPics\image-20251104012159884.png)

| 访问级别 | 访问控制修饰符 | 同类 | 同包 | 子类 | 不同包 |
| :------- | :------------- | :--- | :--- | :--- | :----- |
| 公开     | public         | Y    | Y    | Y    | Y      |
| 受保护   | protected      | Y    | Y    | Y    | X      |
| 默认     | 没有修饰符     | Y    | Y    | X    | X      |
| 私有     | private        | Y    | X    | X    | X      |



**此处不使用代码进行演示**，实际操作很容易发现bug，不需要代码块证明，只需要说明权限级别。



# 封装 Encapsulation


封装就是把抽象出的数据`[属性]`和对数据的操作`[方法]`封装在一起,数据被保护在内部,程序的其它部分只有通过被授权的操作`[方法]`,才能对数据进行操作。

电视机就是典型的封装

## 封装的理解和好处

1. 隐藏实现细节：方法（链接数据库） 调用（传入参数）
2. 可以对数据进行验证，保证安全合理
3. Person{name,age}

## 实现封装

1. 将属性进行私有化private【不能直接修改属性】

2. 提供一个public set方法 用于对属性判断并赋值

   1. ```java
      public void setXxx(var m1){	//(var m1){	///Xxx用于表示某个属性
          //加入数据验证的业务逻辑
          属性=参数名;
      }
      ```

3. 提供一个公共的public get方法，用于获取属性的值

   1. ```java
      public 数据类型 getXxx(var m1){	//权限判断
          return xx;
      }
      ```



在私有化之后，构造器能够跳过方法直接读写属性，所以将构造器和get，set结合

```java
package com.jl.pkg.encap;

public class Encapsulation01 {
	public static void main(String[] args) {
		Person person;
		person = new Person();
		person.setName("cxkImDeadMan");
		person.setAge(3000);
		person.setSalary(2000);
		System.out.println(person.info());
		//person.age="cxk"; 私有化的
		Person jack = new Person("jack", 19, 1000);
		System.out.println(jack.info());
	}
}

class Person {
	public String name;     //姓名公开
	private int age;        //年龄私有化
	private double salary;

	public Person() {
	}

	//有三个属性的构造器
	public Person(String name, int age, double salary) {
//		this.name = name;
//		this.age = age;
//		this.salary = salary;
		//将set方法写在构造器中
		setName(name);
		setAge(age);
		setSalary(salary);
	}

	//自己写set和get太慢了，使用Keymap 然后根据需求完善代码

	public String getName() {
		return name;
	}

	public int getAge() {
		return age;
	}

	public double getSalary() {
		return salary;
	}

	public void setName(String name) {
		//加入对数据的校验
		if (name.length() >= 2 && name.length() <= 6) {
			this.name = name;
		} else {
			System.out.println("名字长度超限（2-6个字符），已设置默认名字");
			this.name = "Manba";
		}
	}

	public void setAge(int age) {
		//加入对对象的校验，以增加业务逻辑
		if (age >= 1 && age <= 120) {   //if right,setAge
			this.age = age;
		} else {
			System.out.println("年龄长度超限（1-120岁），已设置默认年龄");
			this.age = 18;  //给一个默认年龄
		}
	}

	public void setSalary(double salary) {
		//增加对当前对象的权限判断 eg权限不够则不返回
		this.salary = salary;
	}

	//写一个方法返回属性信息
	public String info() {
		return "person的信息为：\n姓名：" + name +
				"\t年龄：" + age + "\t薪水：" + salary;
	}
}
```



## 练习

课堂练习

1. com.hspedu.encap包: AccountTest.java 和 Account.java
2. 创建程序,在其中定义两个类:Account和AccountTest类
3. 体会Java的封装性Account类
4. 要求具有属性:姓名(长度为2位3位或4位)、余额(必须>20)密码(必须是六位)，
5. 如果不满足，则给出提示信息，并给默认值通过setXxx的方法给Account 的属性赋值。
6. 在AccountTest中测试

> 提示知识点:String name=""int len = name.length():



```java
package com.jl.pkg.encap;

public class Account {
	private String name;
	private double balance = 20;
	private String password;

	public Account() {
	}

	public Account(String name, double balance, String password) {
		this.setName(name);
		this.setBalance(balance);
		this.setPassword(name);
	}

	public String getName() {
		return name;
	}

	public double getBalance() {
		return balance;
	}

	public String getPassword() {
		return password;
	}

	public void setName(String name) {
		if (name.length() >= 2 && name.length() <= 4) {
			this.name = name;
		} else {
			System.out.println("超过字符限制（2~4），已返回默认值：def");
			this.name = "def";
		}

	}

	public void setBalance(double balance) {
		if (balance >= 20) {
			this.balance = balance;
		} else {
			System.out.println("余额不足（大于20），已返回默认值：20");
			this.balance = 20;
		}
	}

	public void setPassword(String password) {
		if (password.length() == 6) {
			this.password = password;
		} else {
			System.out.println("密码长度错误（6位），已返回默认值：123456");
			this.password = "123456";
		}

	}

	public void showInfo() {
		//此处添加权限验证if：验证通过，执行语句 else：权限不足
		System.out.println("账号信息为：");
		System.out.println("姓名：" + name);
		System.out.println("余额：" + balance);
		System.out.println("密码：" + password);
	}
}

```



```java
package com.jl.pkg.encap;

public class AccountTest {
	public static void main(String[] args) {

		//创建一个account
		Account account = new Account();
		account.setName("jack666");
		account.setBalance(15);
		account.setPassword("jackie1");
		account.showInfo();
	}
}

```





# 继承 Extends

对象的复用需要继承





```java
package com.jl.pkg.extend_;

public class Extends01 {
	public static void main(String[] args) {
		Pupil pupil = new Pupil();
		pupil.name = "小明";
		pupil.age = 12;
		pupil.testing();
		pupil.setScore(88.5);
		pupil.showInfo();

		System.out.println();
		Graduate graduate = new Graduate();
		graduate.name = "大明";
		graduate.age = 120;
		graduate.testing();
		graduate.setScore(1000);
		graduate.showInfo();

	}

}

```



## 继承的基本原理



继承可以解决代码复用,让我们的编程更加靠近人类思维,当多个类存在相同的属性(变量)和方法时,可以从这些类中抽象出**父类**,在父类中定义这些**相同的属性和方法**，**所有的子类不需要重新定义这些属性和方法**，只需要**通过extends来声明继承父类**即可。画出继承的示意图



![image-20251104152004420](D:\Typora\TyporaPics\image-20251104152004420.png)

class 子类 extends 父类

子类继承父类方法





## 继承细节

子类继承了所有的属性和方法，

非私有的属性和方法能在子类直接访问

**但是私有属性和方法不能在子类直接访问**，

要通过公共的方法去访问，



继承的深入讨论/细节问题

1. 子类必须调用父类的构造器,完成父类的初始化

2. 当创建子类对象时，不管使用子类的哪个构造器，默认情况下总会去调用父类的无参构造器，

3. 如果父类没有提供无参构造器，则必须在子类的构造器中用 `super` 去指定使用父类的哪个构造器完成对父类的初始化工作，否则，编译不会通过()[举例说明]

4. 如果希望指定去调用父类的某个构造器，则显式的调用一下

5. super在使用时，需要放在构造器第一行
   super() 和 this()都只能放在构造器第一行，因此这两个方法不能共存在一个构造器

6. java所有类都是object类的子类

7. 子类最多只能继承一个父类，java是单继承

   让A类继承B类和C类只需要间接调用

8. 不能滥用继承 必须满足 is a的逻辑关系

   Person is a Music？

   Animal

   Cat extends Animal



```java
package com.jl.extend_;

public class Sub extends Base {

	public Sub() {  //sub无参构造器
		//do nothing.
		super();
		System.out.println("无参构造器被调用..");
	}


	public Sub(String name) {   //sub String name构造器
		super("tom");
		System.out.println("Sub name构造器被调用");
	}

	public Sub(String name, int age) {

		super("smith", 10);//调用父类无参构造器，或不写
		System.out.println("sub String name int age构造器被调用");
	}
}

```

```java
package com.jl.extend_;

public class Base extends TopBase{
	//四个属性
	public int n1 = 100;
	protected int n2 = 200;
	int n3 = 300;
	private int n4 = 400;

	public Base() {
		System.out.println("Base无参构造器被调用...");
	}

	public Base(String name) {
		System.out.println("Base有参构造器(String name)被调用...");
	}

	public Base(String name, int age) {
		System.out.println("Base有参构造器(String name,int age)被调用...");
	}

	public void m1() {
		//该方法可以访问四个属性
		System.out.println("n1=" + n1 + " n2=" + n2 + " n3=" + n3 + " n4=" + n4);
	}

	protected void m2() {
	}

	void m3() {
	}

	private void m4() {
	}

	//在同一个类中可以访问所有修饰符
	public void hi() {
		m1();
		m2();
		m3();
		m4();
	}
}

```

```java
package com.jl.extend_;

public class TopBase {
	public TopBase() {
		//无参构造器
		super();
		System.out.println("TopBase被调用");
	}
}

```



### 内存

```java
package com.jl.extend_;

//继承的本质
public class ExtendsTheory {
	public static void main(String[] args) {
		Son son = new Son();//内存的布局

		/* 首先 子类中是否有该属性
		 * 1)如果子类有这个属性，并且可以访问，则返回信息
		 * 2)如果没有，就向上查找，就看父类有没有这个属性，
		 * 3)如果父类有这个属性，并且可以访问，则返回信息
		 * 4)如果父类也没有，按照3的规则继续找上级
		 */
		System.out.println(son.name);       //返回小脑儿子
		System.out.println(son.getAge());        //返回大头爸爸
		System.out.println(son.hobby);      //返回巨头爷爷
	}
}

class Grandpa { //爷爷类
	String name = "巨头爷爷";
	String hobby = "trip";

}

class Father extends Grandpa {  //子类继承grandpa
	String name = "大头爸爸";
	private int age = 39;

	public int getAge() {
		return age;
	}
}

class Son extends Father {  //子类继承father
	String name = "小脑儿子";

}
```



## 练习

### Exercise01



```java
package com.jl.extend_.exercise;

public class ExtendsExercise01 {

	public static void main(String[] args) {
		B b = new B();

		/*cmd
		 * a
		 * b name
		 * b
		 * */
	}
}

class A {

	A() {
		System.out.println("a");
	}

	A(String name) {

		System.out.println("a name");
	}
}

class B extends A {
	B() {
		this("abc");
		System.out.println("b");
	}

	B(String name) {

		System.out.println("b name");
	}


}

```



### Exercise02

```java
package com.jl.extend_.exercise;

public class ExtendsExercise02 {
	public static void main(String[] args) {
		C1 c = new C1();
		/*Command
		 * 我是A类
		 * hahaha我是B类的有参构造
		 * 我是c类的有参构造
		 * 我是c类的无参构造
		 * */
	}
}

class A1 {
	public A1() {
		//super();
		System.out.println("我是A类");
	}
}

class B1 extends A1 {
	public B1() {
		System.out.println("我是B类的无参构造");
	}

	public B1(String name) {
		//super();
		System.out.println(name + "我是B类的有参构造");
	}
}

class C1 extends B1 {
	public C1() {
		this("hello");
		System.out.println("我是c类的无参构造");
	}

	public C1(String name) {
		super("hahaha");
		System.out.println("我是c类的有参构造");
	}
}
```



![image-20251104193014345](D:\Typora\TyporaPics\image-20251104193014345.png)

### Exercise03

```Java
package com.jl.extend_.exercise;

public class ExtendsExercise03 {
	public static void main(String[] args) {
		PC pc = new PC("intel", "500", "IBM", "鞋盒");    //传入一共四个参数
		pc.showInfo();//调用pc中的showInfo，但showInfo调用的是computer中的getDetail()

	}
}

//定义computer类
class Computer {
	//定义computer的属性
	private String cpu;
	private String ram;
	private String storage;

	//构造器初始化对象
	public Computer(String cpu, String ram, String storage) {
		this.cpu = cpu;
		this.ram = ram;
		this.storage = storage;
	}

	//连续使用get,set方法,提取私有属性,公开化
	public String getCpu() {
		return cpu;
	}

	public void setCpu(String cpu) {
		this.cpu = cpu;
	}

	public String getRam() {
		return ram;
	}

	public void setRam(String ram) {
		this.ram = ram;
	}

	public String getStorage() {
		return storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	//返回computer信息getDetail方法
	public String getDetail() {
		return (
				"此计算机的详细信息为：\n" +
						"CPU: " + this.cpu + "\n" +
						"内存: " + this.ram + "\n" +
						"硬盘: " + this.storage
		);
	}
}

//新建PC类
class PC extends Computer {
	//创建私有对象brand
	private String brand;

	// 初始化对象,并用super调用父类的构造器


	public PC(String cpu, String ram, String storage, String brand) {
		super(cpu, ram, storage);    // 借调用PC初始化构造器,为computer构造器赋值
		this.brand = brand;    // 最后一个String brand为PC类中的brand属性赋值
	}

	//使用get set方法,读取private属性brand
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	//showInfo方法,显示输出结果,但Computer类中已经有getDetail方法用于输出结果,此处进行调用,并新加brand进行输出.
	public void showInfo() {
//		System.out.println(getCpu()+getRam()+getStorage());
		//通过调用父类
		System.out.println(getDetail() + "\n品牌：" + this.brand);
	}
}

```

详细解释

````markdown
## 1. `this` 和 `super` 的作用

### `this` - 指向当前对象

```java
this.cpu = cpu;    // 当前对象的cpu属性 = 构造器参数cpu
this.brand = brand; // 当前对象的brand属性 = 构造器参数brand
```

### `super` - 指向父类

```java
super(cpu, ram, storage); // 调用父类的构造器
super.getDetail();        // 调用父类的方法（可省略super）
```

## 2. Getter/Setter 的作用

### 为什么需要getter/setter？

```java
private String cpu; // private：外部不能直接访问

// 提供公共的访问通道
public String getCpu() { return cpu; }        // 读取
public void setCpu(String cpu) { this.cpu = cpu; } // 修改
```

## 3. 完整的组合逻辑流程

### 场景：创建PC对象

```java
PC pc = new PC("intel", "500", "IBM", "鞋盒");
```

### 步骤1：构造器调用链

```java
// PC构造器
public PC(String cpu, String ram, String storage, String brand) {
    super(cpu, ram, storage);    // ① 先调用父类构造器
    this.brand = brand;          // ② 再初始化子类属性
}

// Computer构造器
public Computer(String cpu, String ram, String storage) {
    this.cpu = cpu;      // ③ 初始化父类属性
    this.ram = ram;      // ④ 初始化父类属性  
    this.storage = storage; // ⑤ 初始化父类属性
}
```

**内存中的对象状态：**

```
Computer部分: {cpu="intel", ram="500", storage="IBM"}
PC特有部分: {brand="鞋盒"}
```

### 步骤2：方法调用链

```java
pc.showInfo(); // 调用PC的showInfo方法

public void showInfo() {
    System.out.println(getDetail() + "\n品牌：" + this.brand);
    //           ⑥ 调用父类方法   ⑦ 访问子类属性
}
```

## 4. 访问权限的层次结构

### 直接访问（当前类内部）

```java
// 在Computer类中
this.cpu        // ✓ 可以直接访问自己的private属性

// 在PC类中  
this.brand      // ✓ 可以直接访问自己的private属性
this.cpu        // ✗ 不能直接访问父类的private属性
```

### 通过getter访问（跨类）

```java
// 在PC类中
this.getCpu()   // ✓ 通过公共方法访问父类的private属性
getCpu()        // ✓ 同上，省略this
```

## 5. 实际的内存模型

```
PC对象 [内存地址0x1234]
├── Computer部分
│   ├── cpu = "intel"     (private，只能通过getCpu()访问)
│   ├── ram = "500"       (private，只能通过getRam()访问)  
│   └── storage = "IBM"   (private，只能通过getStorage()访问)
└── PC特有部分
    └── brand = "鞋盒"     (private，只能通过getBrand()访问)
```

## 6. 关键理解点

### 为什么需要这种设计？

1. **封装性**：属性private保护数据安全
2. **继承性**：子类复用父类功能
3. **多态性**：可以统一处理Computer和PC对象

### 记忆技巧

- `this.属性` → 设置当前对象的属性
- `super(参数)` → 调用父类构造器（必须在第一行）
- `getXxx()` → 读取属性（跨类访问的唯一方式）
- `setXxx()` → 修改属性（可加入验证逻辑）

这样设计既保证了数据安全，又提供了灵活的扩展性。理解这个组合逻辑，就掌握了Java面向对象的核心机制！
````



```markdown
PC对象 [内存地址0x1234]
├── Computer部分
│   ├── cpu = "intel"     (private，只能通过getCpu()访问)
│   ├── ram = "500"       (private，只能通过getRam()访问)  
│   └── storage = "IBM"   (private，只能通过getStorage()访问)
└── PC特有部分
    └── brand = "鞋盒"     (private，只能通过getBrand()访问)
```





### AI讨论

```java
非常理解你的感受！这是每个初学者都会经历的阶段。我来分享一些实用的自学方法：
🎯 核心问题：缺乏系统思维
你遇到的具体困境：

知道要写PC类，但不知道从哪开始
写了一半卡住，不知道接下来该写什么
对代码结构没有整体把握

📚 自学必备的思维工具
1. 先规划后编码
在写代码前，先用注释画出蓝图：
// 1. 定义PC类，继承Computer
// 2. 添加特有属性brand
// 3. 编写构造器（调用super）
// 4. 添加getter/setter
// 5. 编写showInfo方法
class PC extends Computer {
    // 在这里填充代码
}

2. 理解继承的"填空题"思维
把继承理解为：
父类已经提供了：□□□□□
子类需要补充：■■■ + □□□□□

你的任务就是填上■■■部分
🔍 具体的学习步骤
第一步：分析需求（5分钟）
// 需求分析：
// - PC是Computer的子类
// - PC比Computer多一个brand属性
// - 要能显示完整信息（包括品牌）

第二步：搭建骨架（10分钟）
class PC extends Computer {
    // 1. 属性
    private String brand;
    
    // 2. 构造器
    public PC(参数) {
        super(参数); // 先填父类的
        this.brand = brand; // 再填自己的
    }
    
    // 3. 方法
    public void showInfo() {
        // 调用父类方法 + 添加品牌信息
    }
}

第三步：填充细节（15分钟）
按部就班地完善每个部分。
🛠️ 实用的练习方法
方法1：注释驱动开发
// TODO 1: 定义属性
// TODO 2: 编写构造器  
// TODO 3: 实现方法

完成一个，删除一个TODO注释。
方法2：模仿改造
找类似的例子，比如：
// 原有：动物 → 猫
// 你要写：计算机 → PC

用相同的模式但不同的内容来练习。
方法3：分步验证
不要一次性写完整段代码：
// 先写构造器，测试创建对象
PC pc = new PC("test", "test", "test", "test");
System.out.println("构造器测试通过");

// 再写showInfo，测试输出
pc.showInfo();

💡 遇到卡壳时的自救指南
立即检查清单：

属性定义了吗？ → private String brand;
构造器调用super了吗？ → super(cpu, ram, storage);
getter/setter写了吗？ → 标准模板
方法逻辑清楚吗？ → 先调用父类方法，再添加新功能

具体话术提醒自己：

"PC比Computer多什么？" → 多一个brand属性
"怎么初始化父类部分？" → 用super()
"怎么访问父类功能？" → 用继承的方法
"怎么组合信息？" → 父类信息 + 子类信息

🚀 推荐的学习节奏

第一周：掌握基础语法，能看懂代码
第二周：模仿写简单类，理解this/super
第三周：练习继承，先抄后改
第四周：独立完成小项目

记住：所有程序员都是从"看了才会，不看就懵"的阶段过来的。关键是建立系统的思维框架，而不是死记硬背代码。
你现在遇到的问题完全正常，坚持下去，很快就能突破这个瓶颈！需要我帮你设计一些循序渐进的练习吗？
```



## Super关键字



**super的使用**

1. //访问父类的属性，但是不能访问父类的private属性
2. //访问父类的方法，但是不能访问父类的private方法
3. //访问父类的构造器，super(参数列表);只能放在构造器的第一句,只能出现一句

**super的便利**

1. 直接使用,this关键字,super关键字,分别提供了三种方式使用`变量`,`构造器`,`方法`,使得结构清晰
2. super会一直查找父类中存在的`变量`,`构造器`,`方法`进行调用,以确保程序正确运行
3. this只会查找当前类中的`变量`,`构造器`,`方法`进行调用
4. **super的访问不限于直接父类，如果爷爷类和本类中有同名的成员，也可以使用super去访问爷爷类的成员;如果多个基类中都有同名的成员，使用super访问遵循就近原则。A->B->C**

### super和this的区别

| 区别点     | this                                                   | super                                    |
| ---------- | ------------------------------------------------------ | ---------------------------------------- |
| 访问属性   | 访问本类中的属性，如果本类没有此属性则从父类中继续查找 | 访问父类中的属性                         |
| 调用方法   | 访问本类中的方法，如果本类没有此方法则从父类继续查找   | 直接访问父类中的方法                     |
| 调用构造器 | 调用本类构造器，必须放在构造器的首行                   | 调用父类构造器，必须放在子类构造器的首行 |
| 特殊       | 表示当前对象                                           | 子类中访问父类对象                       |

```java
package com.jl.super_;
public class A {
	public int n1 = 100;
	protected int n2 = 200;
	int n3 = 300;
	private int n4 = 400;

	public A() {

	}

	public A(String name) {

	}

	public A(String name, int age) {

	}

	public void test100() {
	}

	protected void test200() {
	}

	void test300() {
	}

	private void test400() {
	}
	void cal(){
		System.out.println("A类的cal()方法");
	}
}

public class B extends A {
	int n1 = 888;


	public static void main(String[] args) {

		B b = new B();
		b.sum();

	}

	//访问父类的属性，但是不能访问父类的private属性
	void hi() {                                            //私有的访问权限
		System.out.println(super.n1 + super.n2 + super.n3 /* + super.n4 */);
	}

	void cal() {
		System.out.println("B类中的cal()方法");
	}

	//访问父类的方法，但是不能访问父类的private方法
	void ok() {
		super.test100();
		super.test200();
		super.test300();
		//私有方法
		//super.test400();

	}

	//访问父类的构造器，super(参数列表);只能放在构造器的第一句,只能出现一句
	public B() {
		//super();    //调用无参构造器
		//super("jackie");    //调用三个参数的构造器
		super("jackie", 10);    //调用两个参数的构造器

	}

	void sum() {
		System.out.println("B类的sum方法");
		//希望调用A类的cal方法
		//因为B类中没有cal方法,可以使用以下三种方式调用A类中的cal
		//找cal方法时的顺序是先找本类,本类没有找父类,父类没有继续循环,一直找到cal方法,
		//找到后就调用并且使用

		//1.
		//cal();


		this.cal();  //等价于cal();

		//3.
		//super.cal();  //直接跳过本类,从父类开始查找.
		//演示访问属性的规则
		System.out.println("自动查找n1 " + n1);
		System.out.println("本类的n1 " + this.n1);
		System.out.println("父类的n2 " + super.n1);
	}

}

```



# 方法重写/覆盖 Override



方法重写就是子类有一个方法和父类有一个方法的名称,返回类型,传入参数一样,那么我们就说子类的这个方法覆盖了父类的方法

### 方法重写的注意细节



子类的方法的形参列表,方法名称,要和父类方法的**形参列表**,方法名称完全一样。【演示】

子类方法的返回类型和父类方法返回类型一样，或者是父类返回类型的子类比如 父类 返回类型是 Object,子类方法返回类型是String 【演示】

子类方法的访问范围不能缩小父类的访问权限

```java
/* public > protected > 默认 > private */
```



### 方法重写和重载的对比

| 对比项       | 重载 (Overload)                                              | 重写 (Override)                                              |
| :----------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **发生范围** | 发生在**同一个类**中                                         | 发生在**继承关系**的**父子类**中                             |
| **方法名**   | **必须**相同                                                 | **必须**相同                                                 |
| **形参列表** | **必须不同**（参数的类型、个数或顺序至少有一个不同）         | **必须相同**                                                 |
| **返回类型** | **可以不同**，无要求                                         | **子类方法的返回类型必须与父类方法相同，或者是其子类** (JDK 5.0 后支持返回子类类型) |
| **修饰符**   | **可以不同**，无要求                                         | **子类方法的访问权限不能比父类方法更严格**（例如：父类是 `public`，子类不能是 `protected` 或 `private`) |
| **抛出异常** | 可以抛出不同的异常，对异常类型没有强制要求                   | **子类方法抛出的异常类型必须与父类方法相同，或者是其父类异常的子类，或者不抛出异常** (即：不能抛出新的、更广泛的异常) |
| **核心概念** | **编译时多态** / 静态多态：在编译时根据参数列表决定调用哪个方法 | **运行时多态** / 动态多态：在运行时根据对象的实际类型来决定调用哪个方法 |





### 方法重写的练习


编写一个Person类，包括private属性(name、age)，构造器、方法say(返回自我介绍的字符串)

编写一个Student类，继承Person类，增加private属性(id、score)，以及构造器，定义say方法(返回自我介绍的信息)。

在main中,分别创建Person和Student对象，调用say方法输出自我介绍:

> 韩老师的教程没有使用到set和get方法,我并没有细看
> 在自己写的时候发现没有太大的编译的bug和不理解的地方,根据idea都能知道报错在什么地方
> 重点在于,使用set传入参数这一步,我没有想到在student对象中仍然需要set person中的参数
> 后看老韩讲解时发现老师没有使用set和get方法,而是使用super传入参数,其本质没有太大差别
> 此处老韩用意旨在让学生了解方法重写,重点在say方法的重写

```java
package com.jl.override_;

public class OverrideExercise {
	public static void main(String[] args) {
		//new一个Person对象
		Person person = new Person();
		//set person对象的name,age
		person.setName("jack");
		person.setAge(18);
		//print say方法
		System.out.println(person.say());

		//如上
		Student student = new Student();
		student.setName("kobe");
		student.setAge(24);
		student.setId(10086);
		student.setScore(24.3);
		System.out.println();
		System.out.println(student.say());



	}
}


class Person {
	private String name;
	private int age;

	//创建Person无参构造器初始化对象
	public Person() {

	}

	//使用get set方法 读写私有属性
	public String getName() {
		return name;
	}

	public int getAge() {
		return age;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setAge(int age) {
		this.age = age;
	}

	//创建say方法返回String语句 旨在可以用print直接打印,优化结构
	public String say() {
		return "我是" + this.name + "我的年龄是" + this.age + "岁";
	}

}

class Student extends Person {
	private int id;
	private double score;

	//同Person
	public Student() {

	}

	public void setId(int id) {
		this.id = id;
	}

	public void setScore(double score) {
		this.score = score;
	}

	public int getId() {
		return id;
	}

	public double getScore() {
		return score;
	}

	//返回String语句,并用super调用父类Person的say方法
	public String say() {
		return super.say() + "|我的id是" + this.id + "我的分数是" + this.score;
	}
}


```



# 多态 Polymorphic

## 多态的引入



创建Master类,feed方法传入animal的参数,food的参数

创建Animal类,有Dog,Cat...继承Animal类

创建Food类,有Bone,Fish...继承Food类

**传统的方法带来的问题是代码复用率不高,难以维护**



## 多态的具体体现



在之前的学习中,已经有了多态的体现,如方法**重载Overload**和**方法重写Override**

```java
package com.jl.poly;


public class PolyMethod {
	public static void main(String[] args) {
		//方法重载体现多态
		A a = new A();
		//传入不同的参数,调用不同的sum方法,就体现多态
		System.out.println("sum=" + a.sum(1, 2));
		System.out.println("sum=" + a.sum(1, 2, 3));

		//方法重写体现多态
		B b = new B();
		a.say();
		b.say();

	}
}

class B extends A {
	public void say() {
		System.out.println("B类中的方法被调用...");
	}
}

class A {

	public int sum(int num1, int num2) {
		return num1 + num2;
	}

	public int sum(int num1, int num2, int num3) {
		return num1 + num2 + num3;
	}

	public void say() {
		System.out.println("A类中的say方法被调用...");
	}
}

```



但对象的多态,是一个复杂的过程

## 对象的多态

**Core,Diff,Hard**



1. 对象的编译类型和运行类型可以不一致
2. 编译类型在定义对象时就确定了,不能改变
3. 运行类型是可以变化的
4. 编译类型看定义时 `=`的左边,运行类型看右边
   1. `Animal an1=new Dog();`an1编译类型是Animal,运行类型是Dog
   2. `animal=newCat();` an1的编译类型仍然是Animal,但运行类型是Cat



```java
package com.jl.poly;

public class Poly01 {
	public static void main(String[] args) {
		Master tom = new Master();
		tom.setName("小嘉");

		Dog bigHuang = new Dog();
		bigHuang.setName("大黄");

		Bone boneDBG = new Bone();
		boneDBG.setName("大棒骨");
		Food bone1 = new Bone();
		bone1.setName("大骨头!");

		tom.feed(bigHuang, boneDBG);

		//添加给小猪喂米饭
		Pig pig = new Pig();
		pig.setName("小琪");
		Rice rice = new Rice();
		rice.setName("漂亮饭");
		tom.feed(pig, rice);
	}
}

public class Master {
	private String name;

	public Master() {

	}

	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}

	//使用多态可以解决Master为不同Animal喂食的问题
	//animal 编译类型是Animal,可以指向(接收) Animal 子类的一个对象
	//food 编译类型是Food,可以指向Food子类的对象
	public void feed(Animal animal, Food food) {
		System.out.println("主人" + name + ",给" + animal.getName() + ",吃了" + food.getName());

	}

//	//Master feed Bone to Dog
//	public void feed(Dog dog, Bone bone) {
//		System.out.println("主人 " + name + ",给小狗 " + dog.getName() + ",吃 " + bone.getName());
//	}

}


```

## 多态的注意事项和细节

多态的前提是两个对象(类)存在继承关系

A **Extends** B

### 多态的向上转型

向上转型就是编译类型是父类,运行类型是子类

```java
package com.jl.poly.detail_;

public class PolyDetail01 {
	public static void main(String[] args) {

		//向上转型,父类编译,子类运行
		//父类引用 指向 子类对象
		Animal cat1 = new Cat();
		Object cat2 = new Cat();

		//向上转型的调用方法规则如下:
		//子类可以调用父类的所有成员,需要遵守访问权限
		//但是父类不能调用子类的特有成员
		//因为在编译阶段,能调用哪些成员,是由编译类型决定的
		//cat1.catchMouse();
		//最终的运行效果,需要看子类的具体体现
		//依然是先进后出,先从子类开始找,最底层层级往上
		cat1.sleep();
		cat1.run();
		cat1.play();
		cat1.show();
		cat1.eat();//猫吃鱼

		System.out.println("OK!");

	}
}

```



### 多态的向下转型

1. 法:子类类型引用名=(子类类型)父类引用
2. 只能强转父类的引用，不能强转父类的对象
3. 要求父类的引用必须指向的是当前目标类型的对象
4. 当向下转型后,可以调用子类类型中所有的成员

```
Cat cat = (Cat) cat1;//类似强转
cat.catchMouse();
```



---



属性没有重写之说

### instantof 比较操作符

`instantOf` 比较操作符,用于判断对象的**运行**类型是否为xxx类型,或xxx类型的子类型

```java
package com.jl.poly.detail_;

public class PolyDetail03 {
	public static void main(String[] args) {
		BB bb = new BB();
		System.out.println(bb instanceof AA);
		System.out.println(bb instanceof BB);

		AA aa = new BB();
		System.out.println(aa instanceof AA);
		System.out.println(aa instanceof BB);

		Object obj = new Object();
		System.out.println(obj instanceof AA);

		String str = "Hello";
//		System.out.println(str instanceof AA);
		System.out.println(str instanceof Object);
	}
}


class AA {
}

class BB extends AA {
}
```

![image-20251106191300302](D:\Typora\TyporaPics\image-20251106191300302.png)





### Java动态绑定机制



`A a = new B();`

`编译属性 对象名 = 创建对象 运行类型`

属性看编译类型 方法看运行类型

1. 调用对象方法的时候**该方法会和该对象的内存地址运行类型绑定**

2. 当调用对象属性时**没有**动态绑定机制，哪里声明，哪里使用

```java
package com.jl.poly.dynamic_;

public class dynamic_ {
	public static void main(String[] args) {
		//运行类型是B
		A a = new B();
		//java的动态绑定机制当调用对象方法的时候
		// 该方法会和该对象的内存地址
		// 运行类型绑定当调用对象属性时
		// 没有动态绑定机制，哪里声明，哪里使用
		System.out.println(a.sum());
		System.out.println(a.sum1());
		//Terminal
		//40
		//30

	}
}

class A {
	public int i = 10;

	public int sum() {
		return getI() + 10;
	}

	public int sum1() {
		return i + 10;
	}

	public int getI() {
		return i;
	}
}

class B extends A {
	public int i = 20;

	public int sum() {
		return i + 20;
	}

	public int sum1() {
		return i + 10;
	}

	public int getI() {
		return i;
	}
}
```



### 多态数组



```java
package com.jl.poly.polyarr;


public class PolyArray {
	public static void main(String[] args) {
		Person[] persons = new Person[5];//多态数组
		persons[0] = new Person("jack", 20);
		persons[1] = new Student("jackie", 18, 100);
		persons[2] = new Student("Caixk", 25, 59.5);
		persons[3] = new Teacher("Kobe", 24, 20000);
		persons[4] = new Teacher("Hansp", 48, 25000);
		//循环遍历多态数组 调用say()
		for (int i = 0; i < persons.length; i++) {

			System.out.println(persons[i].say());
			//向下转型
			if (persons[i] instanceof Teacher) {    //使用instantOf判断 向下转型

				//类型转换的两种形式 1
				((Teacher) persons[i]).teach();

				System.out.println();
			} else if (persons[i] instanceof Student) {

				//类型转换的两种形式 2
				Student students = (Student) persons[i];
				students.study();

				System.out.println();
			} else if (persons[i] instanceof Person) {

				System.out.println("你是人");
			} else {
				System.out.println("你的类型有误,请重新检查...");
			}
		}
	}
}

```



---

### 多态参数

```java
package com.jl.poly.polyparameter_;

public class PolyParameter {
	public static void main(String[] args) {
		Employee[] employees = new Employee[3];

		employees[0] = new NormalEmployee("ikun2", 3000);
		employees[1] = new Manager("ikun3", 3000, 20000);

		Test e = new Test();
		e.showEmpAnnal(employees[0]);
		e.showEmpAnnal(employees[1]);
		System.out.println();
		e.testWork(employees[0]);
		e.testWork(employees[1]);
	}


}

```

```java
package com.jl.poly.polyparameter_;

public class Employee {
	private String name;
	private double months;

	public Employee() {

	}

	public Employee(String name, double months) {
		this.name = name;
		this.months = months;
	}

	public double getAnnual() {
		return this.months * 12;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setMonths(double months) {
		this.months = months;
	}

	public String getName() {
		return name;
	}

	public double getMonths() {
		return months;
	}


}

```

```java
package com.jl.poly.polyparameter_;

public class NormalEmployee extends Employee {
	public NormalEmployee(String name, double months) {
		super(name, months);
	}

	public void work() {
		System.out.println("普通员工" + getName() + "正在工作...");
	}

	public double getAnnual() {
		return super.getAnnual();
	}
}

```

```java
package com.jl.poly.polyparameter_;

public class Manager extends Employee {
	private double bonus;

	public Manager(String name, double months, double bonus) {
		super(name, months);
	}

	public void setBonus(double bonus) {
		this.bonus = bonus;
	}

	public double getBonus() {
		return bonus;
	}

	public void manage() {
		System.out.println("经理" + getName() + "正在管理...");
	}


	public double getAnnual() {
		return super.getMonths() + this.bonus;

	}
}

```

```java
package com.jl.poly.polyparameter_;

public class Test {


	public void showEmpAnnal(Employee e) {

		if (e instanceof NormalEmployee) {
			System.out.println("普通员工" + e.getName() + "年度总工资为\t" + e.getAnnual());

		} else if (e instanceof Manager) {
			((Manager) e).getAnnual();
			System.out.println("经理" + e.getName() + "的年度总工资为\t" + e.getAnnual());
		}
	}

	public void testWork(Employee e) {
		if (e instanceof NormalEmployee) {
			((NormalEmployee) e).work();
		} else if (e instanceof Manager) {
			((Manager) e).manage();
		}
	}
}


```

# Object类详解

## `==`和`equals` 运算符

`= =`是一个比较运算符

1. 既可以判断**基本类型**,又可以判断**引用类型**
2. 如果判断基本类型,判断**基本类型的值**是否相等
   `int i = 10; double d=10.0;`
3. 如果判断引用类型,判断**地址的值**是否相等,即判定是不是同一个对象

`equals`智能判断引用类型


```java
package com.jl.Object_;  
  
  
public class Equals01 {  
    public static void main(String[] args) {  
       A a = new A();  
       A b = a;  
       A c = b;  
       //此时,b和c都指向了a所新建的地址  
       System.out.println(a == c);     //true  
       System.out.println(b == c);     //true  
  
  
       B obj = a;//需要建立继承关系  
       System.out.println(obj == c);   //true  
       int num = 10;  
       double num1 = 10.0;  
       System.out.println(num1 == num);//true  
  
       //equals方法的源码怎么查看  
  
       "hello".equals("abc");  
  
       //equals的源码:  
       //把object类的equals重写了,比较两个字符串的值  
  
       /*  
           public boolean equals(Object anObject) {        if (this == anObject) {                             //如果是同一个对象 返回true  
            return true;        }        if (anObject instanceof String) {                   //向下转型  
            String anotherString = (String)anObject;            int n = value.length;            if (n == anotherString.value.length) {          //如果长度相同  
                char v1[] = value;                char v2[] = anotherString.value;                int i = 0;                while (n-- != 0) {                          //比较字符  
                    if (v1[i] != v2[i])                     //有任何一个字符不相等  
                        return false;                       //返回false  
                    i++;                }                return true;                                //如果两个字符串所有字符都相等则返回true  
            }        }        return false;                                       //如果比较的不是字符串,返回false  
    }    */  
  
       Object object = 1;  
       //即obj的equals方法,默认就是比较对象的地址是否相同 即判断两个对象是不是同一个对象  
       //    public boolean equals(Object obj) {  
       //        return (this == obj);       //    }  
       Integer integer = new Integer(311);  
       Integer integer1 = new Integer(311);  
       System.out.println(integer == integer1);            //false  
       System.out.println(integer.equals(integer1));       //true  
  
       String string1 = new String("nb666");  
       String string2 = new String("nb666");  
  
       System.out.println(string1 == string2);             //false  
       System.out.println(string1.equals(string2));        //true  
  
       //Integer也重写了Object中的equals  
       //变成了判断两个数的值是否相同  
       //    public boolean equals(Object obj) {  
       //        if (obj instanceof Integer) {     //传进来的这个值 如果是Integer中的值  
       //            return value == ((Integer)obj).intValue();    //返回  
       //        }  
       //        return false;       //    }  
  
    }  
}  
  
class A extends B {  
  
}  
  
class B {  
  
}
```

### Exe01 如何重写equals()方法

```java
package com.jl.Object_;  
  
public class EqualsExercise01 {  
    public static void main(String[] args) {  
       Person person1 = new Person("蔡徐坤", 25, '男');  
       Person person2 = new Person("蔡徐坤", 25, '男');  
       Person person3 = new Person("科比", 24, '男');  
  
       System.out.println(person1.equals(person2));//true  
       System.out.println(person2.equals(person3));//false  
       //重写.equals()方法  
       System.out.println();  
    }  
  
}  
  
  
class Person {      //默认继承Object类,默认比较两个对象是否相等  
    private String name;  
    private int age;  
    private char gender;  
  
    public boolean equals(Object obj) {  
       //判断比较的两个对象是同一个对象,则直接返回true  
       if (this == obj) {  
          return true;  
       }  
       //类型比较  
       if (obj instanceof Person) { //是Person类中的对象,才比较  
  
          //类型转换  
          //因为我需要得到obj的属性,所以需要向下转型  
          Person p = (Person) obj;  
          return this.name.equals(p.name) && this.age == p.age && this.gender == p.gender;  
       }  
       //如果不是同一个Person,则直接返回false  
       return false;  
    }  
  
    public Person(String name, int age, char gender) {  
       this.name = name;  
       this.age = age;  
       this.gender = gender;  
    }  
}





### Exercise02 判断

```java
package com.jl.Object_;  
  
public class EqualsExercise02 {  
  
    public static void main(String[] args) {  
       Person_ p1 = new Person_();  
       p1.name = "hspedu";  
       Person_ p2 = new Person_();  
       p2.name = "hspedu";  
  
       System.out.println(p1 == p2); // False  
       System.out.println(p1.name.equals(p2.name)); // True  
       System.out.println(p1.equals(p2)); // False  
  
       String s1 = new String("asdf");  
       String s2 = new String("asdf");  
       System.out.println(s1.equals(s2)); // True  
       System.out.println(s1 == s2); // False  
    }  
}  
  
  
class Person_ {  
    public String name;  
}
```

**FTFTF**


### Exercise03 继续判断



**注意char数据类型和ASCII码**

```java
package com.jl.Object_;

public class EqualsExercise03 {

	public static void main(String[] args) {
		int it = 65;
		float fl = 65.0f;
		System.out.println("65和65.0f是否相等?" + (it == fl)); // 输出: true，因为65和65.0在数值上相等

		char ch1 = 'A'; // 'A' 的ASCII值为65
		char ch2 = 12;  // 12 是ASCII字符（换页符）
		System.out.println("65和'A'是否相等?" + (it == ch1)); // 输出: true    因为ascII相等
		System.out.println("12和ch2是否相等?" + (12 == ch2)); // 输出: true    值相等

		String str1 = new String("hello");
		String str2 = new String("hello");
		System.out.println("str1和str2是否相等?" + (str1 == str2)); // 输出: false，因为==比较引用地址
		System.out.println("str1是否equals str2?" + (str1.equals(str2))); // 输出: true，因为equals比较内容

		// 比较字符串字面量和Date对象：总是false，因为类型不同且引用地址不同
		//System.out.println("hello" == new Date(System.currentTimeMillis())); //输出:false 编译错误
	}
}



```



## hashCode()哈希码 

返回对象的哈希码值

老韩的6个小结：

1. 提高具有哈希结构的容器的效率

2. 两个引用，如果指向的是同一个对象，则哈希值肯定是一样的

3. 两个引用，如果指向的是不同对象，则哈希值是不一样的

4. 哈希值主要根据地址号来的，不能完全将哈希值等价于地址

5. 案例演示 [**HashCode.java**]

   ```java
   package com.jl.Object_;
   
   public class HashCode {
   	public static void main(String[] args) {
   		AA aa = new AA();
   		AA aa2 = new AA();
   		System.out.println("aa.hashCode()=\t" + aa.hashCode());
   		System.out.println("aa2.hashCode()=\t" + aa2.hashCode());
   		AA aa3 = aa;
   		System.out.println("aa3.hashCode()=\t" + aa3.hashCode());
   
   	}
   }
   
   class AA {
   
   }
   ```

6. 后面在集合中，hashcode 如果需要的话，也会重写

## toString() 方法



基本介绍  

默认返回：全类名+@+哈希值的十六进制，【查看Object的toString方法】  

**子类往往重写toString方法，用于返回对象的属性信息**  

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

重写toString方法后，打印对象或拼接对象时都会自动调用该对象的toString形式  

案例演示：Monster [name, job, sal]  

案例：ToString.java  

当直接输出一个对象时，toString方法会被默认调用



```java
package com.jl.Object_;

public class ToString {
	public static void main(String[] args) {

		//Object toString的源码

		//    public String toString() {    //返回字符串getClass() 类的全类名,包名+类名
		//        return getClass().getName()
		//        + "@"         //做间隔
		//        + Integer.toHexString(hashCode());
		//    }
		Monster monster = new Monster("小妖", "巡山", 200);
		System.out.println(monster.toString() + "\nhashcode=" + monster.hashCode());
		System.out.println(monster);//默认等价monster.toString()
	}
}

class Monster {
	private String name;
	private String job;
	private double salary;

	public Monster() {
	}

	public Monster(String name, String job, double salary) {
		this.name = name;
		this.job = job;
		this.salary = salary;
	}
	//重写toString方法,输出对象的属性
	//使用快捷键即可生成

	@Override
	public String toString() {  //重写后一般默认写出对象的属性
		return "Monster{" +
				"name='" + name + '\'' +
				", job='" + job + '\'' +
				", salary=" + salary +
				'}';
	}
}

```





## finalize()



Object类详解  
0 finalize方法  
//Finalize.java  

1. 当对象被回收时，系统自动调用该对象的 finalize 方法。子类可以重写该方法，做一些**释放资源**的操作。  
1. 什么时候被回收：当某个对象没有任何引用时，JVM 就认为这个对象是一个垃圾对象，就会使用垃圾回收机制来销毁该对象。在销毁该对象前，会先调用 finalize 方法。  
1. 垃圾回收机制的调用由系统决定(即有自己的GC算法)，也可以通过 System.gc() 主动触发垃圾回收机制。  测试：Car [name]

在实际开发中,几乎不会运用finalize方法 所以更多的是应对面试





# 断点 BreakPoint 调试 Debug



一个实际需求  

1. 在开发中，新手程序员查找错误时，老程序员会提示：用断点调试一步一步看源码执行过程，从而发现错误所在。  
   重要提示：断点调试过程中程序处于运行状态，以对象的运行类型执行。  
   示例：`A extends B; B b = new A(); b.xx();`

## 断点调试介绍  

在程序的某一行设置断点，调试时程序运行到该行会暂停，可逐行继续调试。  
调试过程中可查看各变量当前值；若出错，会在错误代码行停下并显示错误，便于分析定位 Bug。  
**断点调试是程序员必须掌握的技能，能提升 Java 水平，也能帮助查看 Java 底层源代码的执行过程。**



## 断点调试快捷键

`F7`跳入方法内

`F8`跳过,逐行执行代码

`shift+F8`跳出方法

`F9` resume,执行到下一个断点



## 断点调试 Debug01

```java
package com.jl.debug;

public class Debug01 {
	//演示逐行执行
	public static void main(String[] args) {

		int res = 0;
		int sum = 0;
		for (int i = 0; i < 5; i++) {
			sum += i;
			System.out.println("i=" + i);
			System.out.println("sum=" + sum);

		}
		System.out.println("结束循环");
	}

}

```

## 越界异常 Debug02

越界异常

```java
package com.jl.debug;

public class Debug02 {
	public static void main(String[] args) {
		int[] arr = {1, 10, -1};
		//遍历数组没有arr.length-1 length为3,下标为2,越界异常
		for (int i = 0; i <= arr.length /* -1 */; i++) {
			System.out.println(arr[i]);
		}
		System.out.println("退出for循环");
	}
}

```

---

## 追源码 Debug03

演示如何追源码，看看 Java 设计者是怎么实现的（提高编程思想）。 
小技巧：**将光标放在某个变量上，可以看到最新的数据。**



```java
public static void main(String[] args) {
    // debug 源码
    int arr[] = {8, -1, 199, 70, 10};
    // 排序，追入 sort 的源码
    Arrays.sort(arr);
    for (int i = 0; i < arr.length; i++) {
        System.out.print(arr[i] + "\t");
    }
}
```

对数组指定范围进行**双轴快速排序**。
参数：
`a` – 待排序的数组
`left` – 要排序的第一个元素的索引（包含）
`right` – 要排序的最后一个元素的索引（包含）
`leftmost` – 指示该部分是否为范围中的最左段

```markdown
Sorts the specified range of the array by Dual-Pivot Quicksort.
Params:
a – the array to be sorted
left – the index of the first element, inclusive, to be sorted
right – the index of the last element, inclusive, to be sorted
leftmost – indicates if this part is the leftmost in the range
```



---



## 动态断点 Debug04


演示如何直接执行到下一个断点（F9 resume）

断点可以在 debug 过程中动态地下断点。  

```java
public static void main(String[] args) {
    // debug 源码
    int arr[] = {8, -1, 199, 70, 10};
    // 排序，追入 sort 的源码
    Arrays.sort(arr);
    for (int i = 0; i < arr.length; i++) {
        System.out.print(arr[i] + "\t");
    }
    System.out.println("hello100");
    System.out.println("hello200");
    System.out.println("hello300");
    System.out.println("hello400");
    System.out.println("hello500");
    System.out.println("hello600");
    System.out.println("hello700");
}
```

## 追踪对象创建过程 DebugExercise

```java
package com.jl.debug;

//debug对象创建的过程,加深对调试的理解

public class DebugExercise01 {
	public static void main(String[] args) {
		//创建对象的流程
		//1. 加载Person类信息
		//2. 初始化 默认初始化 显式初始化 构造器初始化
		//3. 返回对象的地址

		Person person = new Person("cxk", 18);
		System.out.println(person);
	}
}

class Person {
	private String name;
	private int age;

	public Person() {
	}

	public Person(String name, int age) {
		this.name = name;
		this.age = age;
	}

	public String getName() {
		return name;
	}

	public int getAge() {
		return age;
	}

	@Override
	public String toString() {
		return "super.toString()被重写..." + getName() + " " + " " + getAge();
	}
}

```





# Project 零钱通

项目开发流程说明

项目需求说明

使用Java开发 零钱通项目 可以完成收益入账,消费,查看明细,退出系统等功能

项目的界面



```text
----零钱通菜单----
	1.零钱通明细
	2.收益入账
	3.消费
	4.退出
请选择(1-4):      1
----零钱通明细----
收益入账 +100.0 2021-01-21 17:41 余额:100.0
```









项目代码实现改进
用户输入4退出时，给出提示"你确定要退出吗?y/n"，必须输入正确的y/n ，否则循环输入指令，直到输入y或者 n。在收益入账和消费时，判断金额是否合理，并给出相应的提示。
将面向过程的代码修改成面向对象的方法，编写SmallChanageSysOOPjava 类并使用 SmallChanageSysApp.java 完成测试。

![image-20251107182930322](D:\Typora\TyporaPics\image-20251107182930322.png)

![image-20251107182915116](D:\Typora\TyporaPics\image-20251107182915116.png)

## 面向过程SmallChangeSys

```java
package com.jl.smallchange_;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

public class SmallChangeSys {
	public static void main(String[] args) {



		Scanner scanner = new Scanner(System.in);// 新建扫描器

		// 2. 完成收益明细
		String details = "\n----====\t零钱通明细\t====----\n";
		// 3. 完成入账
		double money = 0;
		double balance = 0;
		boolean loop = true;
		Date date = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh-mm");// 用于日期格式化
		// 4.消费
		// 定义新变量,保存消费的原因
		String note = "";

		// 在处理收益和入账时,判断
		do {
			System.out.println("----====\t零钱通菜单\t====----\n" +
					"\t1.零钱通明细\n" +
					"\t2.收益入账\n" +
					"\t3.消费\n" +
					"\t4.退出\n" +
					"请选择(1-4):");

			// 扫描器请求输入
			String s = scanner.nextLine();

			switch (s) {
				case "1":
					// 执行功能零钱通明细,使用Account类中的showCheck
					System.out.println(details);
					System.out.println();
					break;

				case "2":
					// 执行入账,使用Earns类中的方法
					System.out.print("请输入入账金额:");

					money = scanner.nextDouble();
					scanner.nextLine();
					// 判断输入金额是否正确
					if (money <= 0) {
						System.out.println("输入金额有误,重新输入 case2");
						break;
					}
					balance += money;
					date = new Date();
					details += "\n收益入账\t" + "+" + money + "\t" + sdf.format(date) + "\t" + balance;

					break;
				case "3":
					// 执行消费,使用Spends类中的方法
					System.out.println("输入消费金额...");
					money = scanner.nextDouble();
					scanner.nextLine();
					if (money <= 0 || money > balance) {
						System.out.println("消费金额应该在(0-" + balance + ")");
						break;
					}
					System.out.println("消费说明...");
					note = scanner.nextLine();

					balance -= money;
					date = new Date();
					details += "\n" + note + "\t" + "-" + money + "\t" + sdf.format(date) + "\t" + balance;
					break;

				case "4":
					String sQuit;
					while (true) {
						// 定义一个变量接收输入
						// 使用while和break处理接收到的这个输入是Y或者N
						System.out.println("确认退出零钱通(Y/N)");
						sQuit = scanner.nextLine();

						// if (sQuit.equals("Y") || sQuit.equals("N")) {
						// break;
						// }
						if (sQuit.equals("Y")) {
							System.out.println("成功退出,再见!");
							loop = false;
							break;

						} else if (sQuit.equals("N")) {
							break;
						}
					}

			}

		} while (loop);
		System.out.println("退出了零钱通...........");

	}

}

```



## 面向对象

```java
package com.jl.smallchange_.oop;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;
/*
 * 该类是完成零钱通的各个功能的类
 * 使用OOP(面向对象编程)
 * 将各个功能对应一个方法
 * 1. 显示菜单
 * 2. 零钱通明细
 *
 *
 * */

public class SmallChangeOOP {
	Scanner scanner = new Scanner(System.in);// 新建扫描器


	String details = "\n----====\t零钱通明细\t====----\n";

	double money = 0;
	double balance = 0;
	boolean loop = true;
	Date date = null;
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh-mm");// 用于日期格式化
	String note = "";

	public void mainMenu() {
		System.out.println("显示零钱通菜单");

		do {
			System.out.println("----====\t零钱通菜单\t====----\n" +
					"\t1.零钱通明细\n" +
					"\t2.收益入账\n" +
					"\t3.消费\n" +
					"\t4.退出\n" +
					"请选择(1-4):");

			// 扫描器请求输入
			String s = scanner.nextLine();

			switch (s) {
				case "1":
					// 执行功能零钱通明细,使用Account类中的showCheck
					this.detail();
					break;

				case "2":
					this.income();
					break;
				case "3":
					this.pay();
					break;

				case "4":
					this.quit();
					break;

			}

		} while (loop);
		System.out.println("退出了零钱通...........");

	}

	public void detail() {
		System.out.println(details);
		System.out.println();
	}

	public void income() {
		// 执行入账,使用Earns类中的方法
		System.out.print("请输入入账金额:");

		money = scanner.nextDouble();
		scanner.nextLine();
		// 判断输入金额是否正确
		if (money <= 0) {
			System.out.println("输入金额有误,重新输入 case2");
			return;//退出方法 不再执行后面的代码
		}
		balance += money;
		date = new Date();
		details += "\n收益入账\t" + "+" + money + "\t" + sdf.format(date) + "\t" + balance;

	}

	public void pay() {
		// 执行消费,使用Spends类中的方法
		System.out.println("输入消费金额...");
		money = scanner.nextDouble();
		scanner.nextLine();
		if (money <= 0 || money > balance) {
			System.out.println("消费金额应该在(0-" + balance + ")");
			return;
		}
		System.out.println("消费说明...");
		note = scanner.nextLine();

		balance -= money;
		date = new Date();
		details += "\n" + note + "\t" + "-" + money + "\t" + sdf.format(date) + "\t" + balance;


	}

	public void quit() {
		String sQuit;
		while (true) {
			// 定义一个变量接收输入
			// 使用while和break处理接收到的这个输入是Y或者N
			System.out.println("确认退出零钱通(Y/N)");
			sQuit = scanner.nextLine();

			// if (sQuit.equals("Y") || sQuit.equals("N")) {
			// break;
			// }
			if (sQuit.equals("Y")) {
				System.out.println("成功退出,再见!");
				loop = false;
				break;

			} else if (sQuit.equals("N")) {
				break;
			}
		}
	}
	//...

}

```



```java
package com.jl.smallchange_.oop;


/*直接调用smallChangeOop的对象显示主菜单*/
public class SmallChangeAPP {
	public static void main(String[] args) {
		//创建对象,调用他的方法,完成各个功能
		new SmallChangeOOP().mainMenu();
	}
}

```



## 编程思想

找出不正确的条件,加以判断
