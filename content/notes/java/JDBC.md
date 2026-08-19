---
date: 2026-08-19
tag: java
---



# JDBC

如果不同的数据库，方法不统一，不利于程序管理

java提供了一个规范接口`JDBC`，能够让java程序可以连接任何实现了JDBC接口的的数据库



## JDBC API

一系列接口，它统一和规范了应用程序与数据库的连接、执行MySQL语句，并得到返回结果等各类操作，相关类和接口在`java.sql`与`javax.sql`包中



- `DriverManager `
  - `getConnection(url,user,pwd)` 获取到连接
- `Connection`
  - `createStatement`
  - `preparedStatement(sql)` 生成预处理对象
- `Statement`
  - `executeUpdate(sql)` 执行DML语句，返回影响的行数
  - `executeQuery(sql)` 返回`ResultSet`对象
  - `execute(sql)` 执行任意的SQL，返回bool值
- `PreparedStatement`
  - `executeUpdate(sql)` 执行DML
  - `executeQuery(sql)` 查询语句，返回`ResultSet`对象
  - `execute(sql)` 执行任意的SQL，返回bool值
  - `setXxx(index,value)` 占位符索引，占位符的值
  - `setObject(index,value)` 
- `ResultSet`
  - `next()` 向下移动一行，如果没有下一行，返回一个`false`
  - `previous()` 向上移动一行，



## JDBC 程序编写步骤



1. 注册驱动 -加载Driver类
2. 获取连接 -得到Connection
3. 执行增删改查 -发送SQL给MySQL执行
4. 释放资源 -关闭相关连接



## JDBC 第一个程序

通过JDBC对表actor进行增删改



```java
package com.jl.jdbc.myjdbc;

import java.sql.*;
import java.util.Properties;

public class Jdbc01 {
    public static void main(String[] args) throws SQLException, ClassNotFoundException {

//     注册驱动
       Class.forName("com.mysql.cj.jdbc.Driver");

//     得到连接
       String url = "jdbc:mysql://localhost:3306/javadb";
//     jdbc:mysql:// 规定好表示协议，通过jdbc的方式连接MySQL
//     主机，端口，数据库名
//     MySQL的连接本质就是socket连接
//     将用户名和密码放入到properties对象中

//     user和password是规定好的key，key根据实际情况写
       Properties properties = new Properties();
       properties.setProperty("user", "root");
       properties.setProperty("password", "123456");
       Connection connect = DriverManager.getConnection(url, properties);
//     执行SQL语句
       String sql = "delete from actor where id=1";
       Statement statement = connect.createStatement();
       int rows = statement.executeUpdate(sql); //如果是dml语句,返回的数据就是影响行数

       System.out.println(rows > 0 ? "成功!" : "失败!");


//     关闭连接
       statement.close();
       connect.close();
    }
}
```







##　数据库的几种连接方式



### 练习用 连接

此方法可以复制粘贴用于快速连接MySQL

```java
		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\mysql.properties"));
//		获取相关的信息
		String user = properties.getProperty("user");
		String password = properties.getProperty("password");
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");
//		注册驱动
		Class.forName(driver);

//		得到连接
		Connection connection = DriverManager.getConnection(url, user, password);

```











```java
package com.jl.jdbc.myjdbc;

import org.testng.annotations.Test;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.*;
import java.util.Properties;

public class JdbcConn {
//		连接JDBC的五种方式

	public void connect1() throws ClassNotFoundException, SQLException {

//		注册驱动
		Class.forName("com.mysql.cj.jdbc.Driver");

//		得到连接
		String url = "jdbc:mysql://localhost:3306/javadb";
//		jdbc:mysql:// 规定好表示协议，通过jdbc的方式连接MySQL
//		主机，端口，数据库名
//		MySQL的连接本质就是socket连接
//		将用户名和密码放入到properties对象中

//		user和password是规定好的key，key根据实际情况写
		Properties properties = new Properties();
		properties.setProperty("user", "root");
		properties.setProperty("password", "123456");
		Connection connect = DriverManager.getConnection(url, properties);
//		执行SQL语句
		String sql = "delete from actor where id=1";
		Statement statement = connect.createStatement();
		int rows = statement.executeUpdate(sql); //如果是dml语句,返回的数据就是影响行数

		System.out.println(rows > 0 ? "成功!" : "失败!");


//		关闭连接
		statement.close();
		connect.close();
	}


	public void connect2() throws ClassNotFoundException, InstantiationException, IllegalAccessException, SQLException {
		Class<?> aClass = Class.forName("com.mysql.jdbc.Driver");
		Driver driver = (Driver)aClass.newInstance();
		//		得到连接
		String url = "jdbc:mysql://localhost:3306/javadb";
//		jdbc:mysql:// 规定好表示协议，通过jdbc的方式连接MySQL
//		主机，端口，数据库名
//		MySQL的连接本质就是socket连接
//		将用户名和密码放入到properties对象中

//		user和password是规定好的key，key根据实际情况写
		Properties properties = new Properties();
		properties.setProperty("user", "root");
		properties.setProperty("password", "123456");

		Connection connect = driver.connect(url, properties);
		System.out.println("方式2= " + connect);


	}

@Test
//	此种方法应是目前最简单的方式,教程一共有五种方式,但其实很多 由于配置,版本等问题,经常报错,选择不看了.
	public void connect5() throws IOException, ClassNotFoundException, SQLException {
		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\mysql.properties"));
//		获取相关的信息
		String user = properties.getProperty("user");
		String password = properties.getProperty("password");
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");
//		创建反射
		Class.forName(driver);

		Connection connection = DriverManager.getConnection(url, user, password);

	}
}

```



## 练习

- 使用java完成：

1. 创建news表
2. 使用jdbc添加5条数据
3. 修改id=1的记录，将content改成一个新的消息
4. 删除id=3的记录



```java
package com.jl.jdbc.myjdbc;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class JdbcExer {
	public static void main(String[] args) throws IOException, ClassNotFoundException, SQLException {
		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\mysql.properties"));
//		获取相关的信息
		String user = properties.getProperty("user");
		String password = properties.getProperty("password");
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");
//		创建反射
		Class.forName(driver);

		Connection connection = DriverManager.getConnection(url, user, password);

//		执行SQL语句
		String str1 = "create table news (id INT NOT NULL DEFAULT 0 PRIMARY KEY,content VARCHAR(64) NOT NULL DEFAULT '')";
		String str2 = "insert into news values(1,'新闻1'),(2,'新闻2'),(3,'新闻3'),(4,'新闻4'),(5,'新闻5')";
		String str3 = "update news set content='新的新闻1' where id = 1 ";
		String str4 = "delete from news where id = 3";
		Statement statement = connection.createStatement();
		int rows = statement.executeUpdate(str4);

		System.out.println(rows >0 ? "成功!":"失败!");


	}
}

```





## ResultSet 结果集

1. 表示数据库结果集的数据表，通常通过执行查询数据库的语句生成
2. `ResultSet` 对象保持一个光标指向其当前的数据行。最初，光标位于第一行之前
3. `next`方法将光标移动到下一行，并且由于在`ResultSet`对象中没有更多行时返回`false`，因此可以在`while`循环中使用循环来遍历结果集





```java
		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\mysql.properties"));
//		获取相关的信息
		String user = properties.getProperty("user");
		String password = properties.getProperty("password");
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");
//		创建反射
		Class.forName(driver);

		Connection connection = DriverManager.getConnection(url, user, password);

		Statement statement = connection.createStatement();
//		组织一个SQL语句
		String sql = "Select id,name,sex,borndate from actor";
//		此方法会返回单个结果对象,其存储的数据类型为ByteArray字节数组,
		ResultSet resultSet = statement.executeQuery(sql);

		while (resultSet.next()) {      //此方法会在最后一行之后返回false,用此方法可以遍历表
			int anInt = resultSet.getInt(1);
			String string = resultSet.getString(2);
			String sex = resultSet.getString(3);
			Date borndate = resultSet.getDate(4);

			System.out.println(anInt+"\t"+string+"\t"+sex+"\t"+borndate);
		}

		connection.close();
		statement.close();
		resultSet.close();

```



## SQL 注入

在连接建立以后如果要对数据进行访问和SQL语句

1. Statement -- SQL注入问题
2. PrepareStatement -- 
3. Callablestatement -- 可以调用存取过程



在实际过程中，不会用到Statement，仅有面试题。

SQL注入是利用某些系统没有对用户输入的数据进行充分的检查，而在输入用户数据中注入非法的SQL语句段或恶意攻击数据库，这就是`SQL注入`

要防范Statement，只需要用PrepareStatement来取代Statement即可。







```java
package com.jl.jdbc.statement_;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.*;
import java.util.Properties;
import java.util.Scanner;

public class Statement_ {
	public static void main(String[] args) throws IOException, ClassNotFoundException, SQLException {


		Scanner scanner = new Scanner(System.in);

		System.out.println("请输入用户名");
		String admin_name = scanner.nextLine();
		System.out.println("请输入密码");
		String admin_pwd = scanner.nextLine();


		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\mysql.properties"));
//		获取相关的信息
		String user = properties.getProperty("user");
		String password = properties.getProperty("password");
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");
//		创建反射
		Class.forName(driver);

		Connection connection = DriverManager.getConnection(url, user, password);

		Statement statement = connection.createStatement();
//		组织一个SQL语句
		String sql = "select name,pwd from admin where name =' "
				+ admin_name
				+ "'and pwd = '"
				+ admin_pwd + "'";
		statement.executeQuery(sql);
		ResultSet resultSet = statement.executeQuery(sql);
		if (resultSet.next()) {
			System.out.println("登录成功");
		} else {
			System.out.println("登录失败");
		}

		resultSet.close();
		statement.close();
		connection.close();
	}
}

```





## 预处理查询



1. `PrepareStatement`执行的SQL语句中的参数用问号 来表示。调用`PrepareStatement`对象的`SetXxx()`方法来设置这些参数。`setXxx()`方法有两个参数，第一个参数是要设置的SQL语句中的参数的索引（从1开始），第二个是设置的SQL语句中的参数的值
2. 调用`executeQuery()` -- 返回`ResultSet` 对象
3. 调用`executeUpdate()` -- 执行更新，包括增删改



预处理的好处是

1. 不再使用+拼接SQL语句，减少语法错误
2. 有效的解决了SQL注入问题
3. 大大减少了编译次数，效率较高



```java
package com.jl.jdbc.statement_;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.*;
import java.util.Properties;
import java.util.Scanner;

public class PrepareStatement_ {
	public static void main(String[] args) throws IOException, ClassNotFoundException, SQLException {


		Scanner scanner = new Scanner(System.in);

		System.out.println("请输入用户名");
		String admin_name = scanner.nextLine();
		System.out.println("请输入密码");
		String admin_pwd = scanner.nextLine();


		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\mysql.properties"));
//		获取相关的信息
		String user = properties.getProperty("user");
		String password = properties.getProperty("password");
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");
//		创建反射
		Class.forName(driver);

		Connection connection = DriverManager.getConnection(url, user, password);

//		组织一个SQL语句
//		String sql = "select name,pwd from admin where name =? and pwd = ? ";
		String sql = "insert into admin values (?,?)";

//		该方法实现了接口
		PreparedStatement preparedStatement = connection.prepareStatement(sql);
		preparedStatement.setString(1, admin_name);
		preparedStatement.setString(2, admin_pwd);
		preparedStatement.executeQuery(sql);
		ResultSet resultSet = preparedStatement.executeQuery();
		if (resultSet.next()) {
			System.out.println("登录成功");
		} else {
			System.out.println("登录失败");
		}

		resultSet.close();
		preparedStatement.close();
		connection.close();
	}
}

```







```java
package com.jl.jdbc.statement_;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.*;
import java.util.Properties;
import java.util.Scanner;

public class PreparedStatementDML {
	public static void main(String[] args) throws IOException, ClassNotFoundException, SQLException {


		Scanner scanner = new Scanner(System.in);

		System.out.println("请输入用户名");
		String admin_name = scanner.nextLine();
//		System.out.println("请输入密码");
//		String admin_pwd = scanner.nextLine();


		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\mysql.properties"));
//		获取相关的信息
		String user = properties.getProperty("user");
		String password = properties.getProperty("password");
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");
//		创建反射
		Class.forName(driver);

		Connection connection = DriverManager.getConnection(url, user, password);

//		数据库增删改

//		添加
//		String sql = "insert into admin values (?,?)";

//		修改
//		String sql = "update admin set pwd = ? where name = ?";

//		删除
		String sql = "delete from admin where name = ?";


//		该方法实现了接口

		PreparedStatement preparedStatement = connection.prepareStatement(sql);
		preparedStatement.setString(1, admin_name);
//		preparedStatement.setString(2, admin_pwd);

		int rows = preparedStatement.executeUpdate();
		System.out.println(rows > 0 ? "成功。" : "失败。");

		preparedStatement.close();
		connection.close();
	}
}

```









## JDBCUtils 增伤改查



```mysql
package com.jl.jdbc.jdbcUtils;

import org.testng.annotations.Test;

import java.sql.*;

public class UtilsTest {

	@Test
	public void testSelect() {
		Connection connection = JDBCUtils.getConnection();
		String sql = "Select * from actor where id = ?";

		PreparedStatement preparedStatement = null;

		ResultSet resultSet = null;
		try {
//			声明
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, 2);

//			执行
			preparedStatement.executeQuery();
//			遍历
			resultSet = preparedStatement.executeQuery();
			while (resultSet.next()) {      //此方法会在最后一行之后返回false,用此方法可以遍历表
				int anInt = resultSet.getInt(1);
				String string = resultSet.getString(2);
				String sex = resultSet.getString(3);
				Date borndate = resultSet.getDate(4);
				String phone = resultSet.getString(5);
				System.out.println("========================================");
				System.out.println(anInt + "\t" + string + "\t" + sex + "\t" + borndate + "\t" + phone);
			}
			System.out.println("========================================");
			System.out.println();
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtils.close(resultSet, preparedStatement, connection);
		}
	}

	@Test
	public void testDML() {
//		得到连接
		Connection connection = JDBCUtils.getConnection();

//		组织一个SQL语句
		String sql = "update actor set name = ? where id = ? ";

//		创建一个preparedStatement
		PreparedStatement preparedStatement = null;
		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setString(1, "周星驰");
			preparedStatement.setInt(2, 2);

//			开始执行
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtils.close(null, preparedStatement, connection);
		}


	}
}

```





# 事务

1. JDBC程序中当一个Connection对象创建时，默认情况下是自动提交事务，每次执行一个SQL语句，如果执行成功，就会向数据库自动提交，而不能回滚
2. JDBC为了让多个SQL成为一体执行，需要使用事务
3. 调用Connection的`setAutoCommit(false)` 可以取消自动提交事务
4. 在所有的SQL语句都成功执行后，调用Connection的`commit()` 方法提交事务
5. 在其中某个操作失败或异常时，调用`rollback()`回滚





```java
package com.jl.jdbc.transaction_;

import com.jl.jdbc.jdbcUtils.JDBCUtils;
import org.testng.annotations.Test;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;


@Test
public class Transaction_ {


	public void transaction() {
//		操作转账业务
//		得到连接
		Connection connection = JDBCUtils.getConnection();

//		组织一个SQL语句
//		给马云给马化腾转200块钱
		String sql = "update account set balance = balance - ? where name = ? ";
		String sql1 = "update account set balance = balance + ? where name = ? ";


//		创建一个preparedStatement
		PreparedStatement preparedStatement = null;
		try {
			connection.setAutoCommit(false);

			preparedStatement = connection.prepareStatement(sql1);
			preparedStatement.setInt(1, 200);
			preparedStatement.setString(2, "马云");

			if (preparedStatement.executeUpdate() == 0) {
				throw new SQLException("收款人不存在: 马云");   // ← 主动抛异常，触发回滚
			}

			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, 200);
			preparedStatement.setString(2, "马化腾");

			if (preparedStatement.executeUpdate() == 0) {
				throw new SQLException("付款人不存在: 马化腾");
			}
//			开始执行

			connection.commit();
		} catch (SQLException e) {
			try {
				connection.rollback();
				System.out.println("发生了错误 回滚"+e.getMessage());
			} catch (SQLException ex) {
				throw new RuntimeException(e);
			}
			throw new RuntimeException(e);

		} finally {
			JDBCUtils.close(null, preparedStatement, connection);
		}


	}
}

```

这个主要是演示了在Java程序中的事务操作，Java中默认是自动提交的

也就是SQL中不带start transaction的形式，整体没什么变化。

老师没有讲到 实际上根本没有捕获到异常，我自己试验了

需要判断一下·`preparedStatement.executeUpdate() == 0`

并且出现了低级错误：if判断语句实际上会执行语句，然后根据返回值进行判断

我错误的将`preparedStatement.executeUpdate()`执行了两次



## 批处理

1. 当需要**成批插入** 或者更新记录时，可以采用java的批量更新机制，这一机制允许多条语句一次性提交给数据库批量处理，通常情况下比单独提交更有效率
2. JDBC的批量处理语句包括如下方法
   1. `addBatch()` 需要添加批量处理的SQL语句和参数
   2. `executeBatch()`执行批量处理
   3. `clearBatch` 清空批处理包的语句
3. JDBC连接MySQL时，如果要使用批处理功能，请在url中加参数`rewriteBatchedStatements = true`;
4. 批处理往往和PreparedStatement一起搭配使用，可以既减少编译次数，又减少运行次数，效率大大提高





## 传统连接池弊端分析



java程序：

1. 得到连接
2. 发送SQL到MySQL
3. 关闭连接



如果拿到了一个连接，及时关闭5000次，也会耗时很长





1. 传统JDBC数据库使用DriverManager获取，需要数据库连接时，就向数据库要求一个，频繁的进行数据库连接操作将占用很多的系统资源，容易造成服务器崩溃
2. 每一次数据连接使用完后要断开，如果程序出现异常而没能关闭，就会报错`Too Many Connections`  
3. 传统获取连接的方式，不能控制创建的连接数量，如连接过多，也可能导致内存泄漏，MySQL崩溃 
4. 解决传统开发中的数据库连接问题，可以采用数据库连接池技术（`connection pool`）





# 数据库连接池

1. 预先在缓冲池中放入一定数量的连接，当需要建立数据库连接时，只需要从缓冲池中去除一个，使用完毕之后再放回去 
2. 数据库连接池负责分配、管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接，而不是重新建立一个。
3. 当应用程序向连接池请求的连接数超过最大的连接数量时，这些请求将被加入到等待队列中





当有了数据库连接池后

java连接数据库的步骤就变为：

1. 从连接池取出连接
2. 使用连接，操作MySQL
3. 连接放回连接池（即该连接可以复用）



当连接池中的所有连接都在使用，新的java程序就会到达等待队列



数据库连接池种类：

1. JDBC的数据库连接池用`javax.sql.DataSource`来表示，DataSource只是一个接口，该接口通常由第三方提供实现
2. `C3P0` 速度相对较慢，稳定性不错（`hibernate`，`spring`）
3. `DBCP` 速度相对C3P0较快，但不稳定
4. `Proxool`，有监控连接池状态的功能，稳定性较C3P0差一点
5. `BoneCP` 速度快
6. `Druid` 德鲁伊 是阿里提供的数据库连接池，集DBCP，C3P0，Proxool优点于一身的数据库连接池





## C3P0



```java
package com.jl.jdbc.datasource_;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.testng.annotations.Test;

import javax.naming.ContextNotEmptyException;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class C3P0 {

	@Test
	public void testC3P0() throws Exception {

//		创建数据源对象
		ComboPooledDataSource comboPooledDataSource = new ComboPooledDataSource();

//		通过配置文件mysql.properties 获取相关连接的信息


		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\mysql.properties"));

		String user = properties.getProperty("user");
		String pwd = properties.getProperty("password");
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");

		Class.forName(driver);

//		给数据源 comboPooledDataSource 设置相关的参数
		comboPooledDataSource.setDriverClass(driver);
		comboPooledDataSource.setJdbcUrl(url);
		comboPooledDataSource.setUser(user);
		comboPooledDataSource.setPassword(pwd);

//		设置初始化连接
		comboPooledDataSource.setInitialPoolSize(10);   //初始化连接数
		comboPooledDataSource.setMaxPoolSize(50);       //最大连接数
		Connection connection = comboPooledDataSource.getConnection();  //核心方法：此方法就是由datasource接口实现的
		System.out.println("连接成功");

		connection.close();


	}

	@Test
	//	第二种方式，使用配置文件模板来完成
	public void testC3P0_2() throws SQLException {

		//	C3P0 会自动从 classpath 根目录加载 c3p0-config.xml
		//	无参构造使用 default-config 中的配置
		ComboPooledDataSource comboPooledDataSource = new ComboPooledDataSource();
		Connection connection = comboPooledDataSource.getConnection();
		System.out.println("连接OK");
		connection.close();
	}

}

```



```xml
<c3p0-config>
    <default-config>
<!--        驱动-->
        <property name="driverClass">com.mysql.cj.jdbc.Driver</property>
<!--        数据库路径-->
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/javadb?useSSL=false</property>
<!--        账号-->
        <property name="user">root</property>
<!--        密码-->
        <property name="password">123456</property>
<!--        初始连接数-->
        <property name="initialPoolSize">5</property>
<!--        最小连接数-->
        <property name="minPoolSize">5</property>
<!--        最大连接数-->
        <property name="maxPoolSize">20</property>

        <property name="maxIdleTime">300</property>
        <property name="testConnectionOnCheckin">true</property>
        <property name="preferredTestQuery">SELECT 1</property>
    </default-config>
</c3p0-config>
```



## 德鲁伊







```java

package com.jl.jdbc.datasource_;

import com.alibaba.druid.pool.DruidDataSourceFactory;
import org.testng.annotations.Test;
import javax.sql.DataSource;
import java.io.FileInputStream;
import java.sql.Connection;
import java.util.Properties;

public class Druid_ {

	@Test
	public void testDruid1() throws Exception {

//		读取配置文件
		Properties properties = new Properties();
		properties.load(new FileInputStream("src\\druid.properties"));

//		创建数据源
		DataSource dataSource = DruidDataSourceFactory.createDataSource(properties);
//		创建连接
		Connection connection = dataSource.getConnection();

		System.out.println("连接成功");

		connection.close();



	}
}

```





```properties
driverClassName = com.mysql.cj.jdbc.Driver
url = jdbc:mysql://localhost:3306/javadb?useSSL=false&useUnicode=true&characterEncoding=utf8
username = root
password = 123456
initialSize = 5
minIdle = 3
maxActive = 20
maxWait = 10000
```







### Druid工具类





```java
package com.jl.jdbc.datasource_;

import com.alibaba.druid.pool.DruidDataSourceFactory;

import javax.sql.DataSource;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class JDBCUtilsByDruid {

	private static DataSource ds;


//	静态代码块
	static {
		Properties properties = new Properties();
		try {
			properties.load(new FileInputStream("src\\druid.properties"));
			ds = DruidDataSourceFactory.createDataSource(properties);

		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

//	得到连接的发放方法
	public static Connection getConnection() throws SQLException {
		return ds.getConnection();
	}

	//	关闭连接：在数据库连接池技术中 close并不是断开连接，只是把Connection对象放回连接池
//	放回连接池的方法
	public static void close(ResultSet resultSet, Statement statement, Connection connection) {

		try {
			if (resultSet != null) {
				resultSet.close();
			}
			if (statement != null) {
				statement.close();
			}
			if (connection != null) {
				connection.close();
			}
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
}

```





# Apache DBUtils



1. 关闭Connection后，resultset结果集无法使用
2. resultSet不利于数据的管理



简单的用一个Actor，创建一个链表来存储结果集的记录信息，这样就可以在关闭连接后也可以访问结果



引入Apache DBUtils



1. commons-dbutils是Apache组织提供的一个开源JDBC工具类库，它对JDBC的封装，使用dbutils能极大简化jdbc编码的工作量，

- DbUtils类

1. QueryRunner类：该类封装了SQL的执行，是线程安全的。可以实现增删改查批处理
2. 使用QueryRunner类实现查询
3. ResultSetHandler接口：该接口用于处理java.sql.ResultSet，将数据按要求转换为另一种形式

| 方法                 | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| ArrayHandler         | 把结果集中的第一行数据转成对象数组                           |
| ArrayListHandler     | 把结果集中的每一行数据都转成一个数组，再存放到List中         |
| BeanHandler          | 把结果集中的第一行数据封装到一个对应的JavaBean实例中         |
| BeanListHandler      | 把结果集中的每一行数据都封装到一个对应的JavaBean实例中，存放到List里 |
| ColumnListHandler    | 把结果集中某一列的数据存放到List中                           |
| KeyedHandler（name） | 将结果集中的每行数据都封装到Map中，再把这些Map再存到一个Map里，其key为指定的key |
| MapHandler           | 将结果集中的第一行数据封装到一个Map里，key是列名，value就是对应的值 |
| MapListHandler       | 将结果集中的第一行数据封装到一个Map里，然后再存放到List      |



## 底层代码：

> 此处由AI生成

**核心逻辑:** 创建预编译 -> 填参数 -> 执行 -> Handler处理 -> 关资源



```java
// 源码截取（简化了异常处理）
private <T> T query(Connection conn, boolean closeConn, String sql, 
                    ResultSetHandler<T> rsh, Object... params) throws SQLException {
    // 1. 检查参数是否为空
    if (conn == null) throw new SQLException("Null connection");
    if (sql == null) throw new SQLException("Null SQL statement");
    if (rsh == null) throw new SQLException("Null ResultSetHandler");

    PreparedStatement stmt = null;
    ResultSet rs = null;
    T result = null;

    try {
        // 2. 创建 PreparedStatement（注意这里传入了 RETURN_GENERATED_KEYS）
        stmt = this.prepareStatement(conn, sql);
        
        // 3. 填充占位符参数（核心：把 Object[] 转换成 JDBC 类型）
        this.fillStatement(stmt, params);
        
        // 4. 执行查询，拿到 ResultSet
        rs = stmt.executeQuery();
        
        // 5. 调用你传入的 Handler 把 ResultSet 转换成 Java 对象
        result = rsh.handle(rs);
        
    } catch (SQLException e) {
        // 6. 重写异常信息，方便定位是哪条 SQL 错了
        this.rethrow(e, sql, params);
    } finally {
        // 7. 关闭资源（关键！）
        try {
            close(rs);
        } finally {
            close(stmt);
            if (closeConn) { 
                close(conn); // 只有当你传入了 DataSource 时，这里才会关
            }
        }
    }
    return result;
}
```





```java
// 源码截取
public void fillStatement(PreparedStatement stmt, Object... params) throws SQLException {
    if (params == null) return;
    
    for (int i = 0; i < params.length; i++) {
        Object param = params[i];
        // 关键点：如果传进来的是 null，必须明确告诉 JDBC 这个字段的 SQL 类型
        if (param == null) {
            stmt.setNull(i + 1, Types.VARCHAR); // 默认当作 VARCHAR
        } else {
            // 如果不是 null，直接调用 stmt.setObject(i+1, param)
            // JDBC 驱动会根据 param 的实际类型（Integer/String/Date）自动映射
            stmt.setObject(i + 1, param);
        }
    }
}

```





| 底层组件     | 实现逻辑                                                     |
| :----------- | :----------------------------------------------------------- |
| **参数处理** | 循环遍历 `Object[]`，调用 `PreparedStatement.setObject()`，支持 `null`（默认为 VARCHAR）。 |
| **结果映射** | 完全交给 `ResultSetHandler`，常用实现基于**反射 + 内省**完成 Bean 属性填充。 |
| **资源释放** | 在 finally 块中 **逆序关闭**（RS -> ST -> CONN），且关闭异常被**静默吞噬**。 |
| **异常增强** | 捕获 SQLException 后，拼接 SQL 语句和参数，重新抛出增强后的异常。 |
| **线程安全** | `QueryRunner` 本身是**无状态的**（没有成员变量存储数据），所以可以**单例多线程共用**。 |



## 应用实例

使用DBUtils+数据库连接池 （德鲁伊）方式，完成对表Actor的CRUD







```java
package com.jl.jdbc.datasource_;

import com.jl.jdbc.jdbcUtils.JDBCUtils;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.testng.annotations.Test;

import java.sql.*;
import java.util.List;

public class JDBCUtilsByDruid_USE {

	@Test
//	使用Apache-DBUtils类+Druid完成对表的CRUD操作
	public void testQueryMany() throws SQLException { //返回多行记录的形式

//		得到一个连接
		Connection connection = JDBCUtilsByDruid.getConnection();
//		使用DBUtils 类和接口，先引入DBUtils的jar文件，放入libs，并在项目结构中添加此文件
//		创建QueryRunner
		QueryRunner queryRunner = new QueryRunner();
		String sql = "Select * from actor where id >= ?";
//		就可以执行相关方法，返回ArrayList结果集
//		返回集合
//		Connection 连接
//		SQL：执行的SQL语句
//		new BeanListHandler<>(Actor.class) 再将Resultset -> Actor对象 -> 封装到ArrayList
//		底层使用反射机制，去获取Actor类的属性，然后进行封装
//		1就是SQL语句中的?的赋值,可以有多个值,因为是可变参数Object...params
//      结果集的底层得到的ResultSet会在Query关闭,还会关闭PreparedStatement
		List<Actor> list = queryRunner.query(connection, sql, new BeanListHandler<>(Actor.class), 1);


		System.out.println("输出集合的信息");
		for (Actor actor : list) {
			System.out.println(actor);
		}

//		释放资源
		JDBCUtilsByDruid.close(null, null, connection);

	}


	//	演示Apache-DBUtils + druid 连接池 完成 返回的结果是单行记录（单个对象）
	@Test
	public void testQuerySingle() throws SQLException {

//		创建连接
		Connection connection = JDBCUtilsByDruid.getConnection();
//		创建QueryRunner
		QueryRunner queryRunner = new QueryRunner();
//		创建SQL语句
		String sql = "select * from actor where id = ?";
//		因为返回单行记录 -- 单个对象， 使用的Handler是BeanHandler
		Actor query = queryRunner.query(connection, sql, new BeanHandler<>(Actor.class), 2);
//		输出记录
		System.out.println(query);
//		顺序因为底层是不能调的
		JDBCUtilsByDruid.close(null, null, connection);

	}

	//	演示Apache dbutils +Druid ,完成查询单行单列的情况
	@Test
	public void testScalar() throws SQLException {

//		创建连接
		Connection connection = JDBCUtilsByDruid.getConnection();
//		创建QueryRunner
		QueryRunner queryRunner = new QueryRunner();
//		创建SQL语句
		String sql = "select name from actor where id = ?";
//		因为返回单行单列记录 -- 单个对象， 使用的Handler是ScalarHandler
		Object obj = queryRunner.query(connection, sql, new ScalarHandler<>(), 2);

//		输出记录
		System.out.println(obj);        // 如果返回的内容不存在,对象就为null,此处可以自行设计逻辑
//		顺序因为底层是不能调的
		JDBCUtilsByDruid.close(null, null, connection);
	}

	//	演示Apache dbutils +Druid ,完成DML的情况
	@Test
	public void testDML() throws SQLException {

//		创建连接
		Connection connection = JDBCUtilsByDruid.getConnection();
//		创建QueryRunner
		QueryRunner queryRunner = new QueryRunner();


//		组织SQL完成update,insert,delete
		String sql = null;
		int option = 2;

		if (option == 1) { //更新
			sql = "update actor set name = ? where id = ?";
		} else if (option == 2) {
			sql = "insert into actor values(null,?,?,?,?)";

		} else if (option == 3) {
			sql = "delete from actor where id = ?";
		}


//		执行DML操作是QueryRunner.update() 可以完整的DML操作,返回值受影响的行数

//		int affectedRow = queryRunner.update(connection, sql, "周星驰new", 2);
		int update = queryRunner.update(connection, sql, "果果大王", "女", Timestamp.valueOf("2003-04-05 00:00:00"), "100");
//		int update1 = queryRunner.update(sql, 2);




//		输出记录

//		System.out.println(affectedRow > 0 ? "执行成功" : "执行没有影响表");        // 如果返回的内容不存在,对象就为null,此处可以自行设计逻辑
		System.out.println(update > 0 ? "执行成功" : "执行没有影响表");        // 如果返回的内容不存在,对象就为null,此处可以自行设计逻辑
//		System.out.println(update1 > 0 ? "执行成功" : "执行没有影响表");        // 如果返回的内容不存在,对象就为null,此处可以自行设计逻辑
//		顺序因为底层是不能调的

		JDBCUtilsByDruid.close(null, null, connection);
	}

}

```





# DAO和增删改查通用方法 BasicDao

- Apache-dbutils+Druid简化了JDBC开发，但还有不足

1. SQL语句是固定，不能通过参数传入，通用性不好，需要进行改进，更方便增删改查
2. 对于select操作，如果有返回值，返回类型不能固定，需要使用泛型
3. 将来的表很多，业务需求复杂，不可能只靠一个java类完成
4. 引出BasicDAO







**BasicDAO：**将每个表的DAO公有操作，放到BasicDAO中，简化代码并提高维护性和可读性



>  【javabean，domain，pojo】









## 应用实例



完成一个简单设计

com.dao_包

1. utils 工具类
2. domain javabean
3. dao 存放XxxDAO和BasicDAO
4. test 测试类





**BasicDAO**

```java
package com.jl.jdbc.dao_.dao;

import com.jl.jdbc.dao_.utils.JDBCUtilsByDruid;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class BasicDAO<T> {

	private QueryRunner qr = new QueryRunner();


	//	开发通用的dml方法，针对任意的表
	public int update(String sql, Object... params) {

		Connection connection = null;

		try {
			connection = JDBCUtilsByDruid.getConnection();
			int update = qr.update(connection, sql, params);
			return update;

		} catch (SQLException e) {
			throw new RuntimeException(e);

		} finally {
			JDBCUtilsByDruid.close(null, null, connection);

		}
	}


	public List<T> queryMulti(String sql, Class<T> clazz, Object... params) {

		Connection connection = null;

		try {
			connection = JDBCUtilsByDruid.getConnection();
//			返回多行记录,要用BeanListHandler; BeanHandler只返回单行单个对象
			return qr.query(connection, sql, new BeanListHandler<T>(clazz), params);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilsByDruid.close(null, null, connection);
		}

	}

	public T querySingle(String sql, Class<T> clazz, Object... params) {

		Connection connection = null;

		try {
			connection = JDBCUtilsByDruid.getConnection();
//			返回多行记录,要用BeanListHandler; BeanHandler只返回单行单个对象
			return qr.query(connection, sql, new BeanHandler<T>(clazz), params);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilsByDruid.close(null, null, connection);
		}
	}

	public Object queryScalar(String sql, Class<T> clazz, Object... params) {

		Connection connection = null;

		try {
			connection = JDBCUtilsByDruid.getConnection();
//			返回多行记录,要用BeanListHandler; BeanHandler只返回单行单个对象
			return qr.query(connection, sql, new ScalarHandler<T>(), params);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilsByDruid.close(null, null, connection);
		}
	}

}

```





**TestDAO**

```java
package com.jl.jdbc.dao_.test;

import com.jl.jdbc.dao_.dao.ActorDAO;
import com.jl.jdbc.dao_.domain.Actor;
import org.testng.annotations.Test;

import java.util.List;

public class TestDAO {

//	测试ActorDAO 对Actor表CRUD操作

	@Test
	public void testActorDAO() {
		ActorDAO actorDAO = new ActorDAO();
//		查询
		List<Actor> actors = actorDAO.queryMulti("SELECT * FROM Actor WHERE id >= ?", Actor.class, 1);

		System.out.println("查询结果:");
		for (Actor actor : actors) {
			System.out.println(actor);
		}

//	    单行查询
		Actor actor = actorDAO.querySingle("SELECT * FROM Actor WHERE id = ?", Actor.class, 2);
		System.out.println("单行查询:");
		System.out.println(actor);

//		单行单列查询
		Object o = actorDAO.queryScalar("SELECT name FROM Actor WHERE id = ?", 3);
		System.out.println("单行单列查询:");
		System.out.println(o);

//      DML操作
		int update = actorDAO.update("INSERT INTO Actor values(null,?,?,?,?) ", "张无忌", "男", "2000-11-11", "1100");
		System.out.println(update > 0 ? "执行成功" : "执行没有影响表");

	}


}

```





**ActorDAO**

```java
package com.jl.jdbc.dao_.dao;

import com.jl.jdbc.dao_.domain.Actor;

public class ActorDAO extends BasicDAO<Actor> {

//	1. BASICDAO的方法
//	2. 根据业务需求,编写特有的方法

}

```





