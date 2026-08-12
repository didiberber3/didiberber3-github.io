---
date: 2026-07-05
tags: Mysql
---





# 多表查询 重点！



- **说明**

多表查询是指基于两个和两个以上的表查询，在实际应用中，单个表几乎不可能满足实际要求，需要同时使用多个表的信息



## 写SQL的思想，先写一个简单的语句，然后增加子句

- **【笛卡尔集】**

1.  从table1中，取出一行，和table2的每一行进行组合
	返回结果【包含有两张表的所有列】
2.  一共返回的记录数 是 tabl1*tabl2的行数
3.  这样多表查询默认处理返回的结果，称为**笛卡尔集**
4.  解决多表的关键，就是写出正确的过滤条件 
	也就是WHERE语句 这个语句需要程序员进行分析才能写出



```mysql
-- 多表查询练习

-- 显示雇员名，雇员工资，以及所在部门的名字
/*
	1. 雇员名 雇员工资 来自emp表
	2. 部门的名字 来自dept表 （索引自emp表中的deptno字段）
	3. 需求对emp和dept查询
	4. 当我们需要指定显示某个表的列时，需要table.column
*/

SELECT ename,sal,dname,dept.deptno
	FROM emp , dept
	WHERE emp.deptno = dept.deptno;

-- 多表查询的条件不能少于 表的个数-1 否则会出现【笛卡尔集】
SELECT * 
	FROM emp,dept -- 【笛卡尔集】
-- 显示部门号为10的部门名，员工名 和工资
SELECT ename,sal,dname,dept.deptno
	FROM emp , dept
	WHERE emp.deptno = dept.deptno AND dept.deptno=10;
-- 显示各个员工的姓名，工资 工资的级别
SELECT  ename,sal ,grade 	
	FROM emp,salgrade
	WHERE sal BETWEEN losal AND hisal
```



## 练习

显示雇员名 雇员工资 及所在部门的名字，并按部门的降序排列

```mysql
练习 显示雇员名 雇员工资 及所在部门的名字，并按部门的降序排列
SELECT ename,sal,dept.dname
	FROM emp,dept
	WHERE emp.deptno = dept.deptno
	ORDER BY emp.deptno DESC
	
```



## 自连接

自连接是指在同一张表的连接查询【将同一张表看作两张表】

- 自连接的特点
  1. 把同一张表当做两张表使用
  2. 需要给表取别名，`table alias`
  3. 列名不明确，可以指定列的别名 `column1 as alias`

显示公司员工和他上级的名字。

```mysql
-- 多表查询的自连接

-- 显示员工名字和他上级的名字
SELECT worker.ename as '职员',boss.ename as '上级'
	FROM emp worker,emp boss
	WHERE worker.mgr = boss.empno;

SELECT * FROM emp;

```



#　子查询



子查询是指嵌入在其他SQL语句中的`SELECT`语句，也叫嵌套语句

- 单行子查询
  - 只返回一行数据的子查询语句
- 多行子查询
  - 返回多行数据的子查询 使用关键字 `IN`



## 练习

- 如何查询如何显示与SMITH同一部门的所有员工

```mysql
-- 1 先查询到SMITH的部门号
SELECT *
	FROM emp
	WHERE deptno = (
		SELECT deptno
		FROM emp
		WHERE ename = 'SMITH'
		);
```

- 查询和部门10的工作相同的雇员的
  名字、岗位、工资、部门号、但是不含10自己的.

```mysql
/*
	1. 查询到10号部门有哪些工作
	2. 把查询的结果当做子查询
*/

SELECT ename,job,sal,deptno
	FROM emp
	WHERE job IN (
		SELECT DISTINCT job
		FROM emp
		WHERE deptno = 10
	) AND deptno != 10; -- != 也可以用<>
```



## 子查询当做临时表使用

- 查询`ecshop`中各个类别中，价格最高的商品



> 这个表我没有



```mysql
-- 查询商品表 1表
SELECT goods_id,cat_id,goos_name,shop_price
	FROM ecs_goods

-- 得到各个类别的价格最高的商品 2表
SELECT cat_id,MAX(shop_price)
	FROM ecs_goods
	GROUP BY cat_id

-- 将2表作为临时表，得到最终的各个类别中价格最高的商品
SELECT goods_id,ecs_goos.cat_id,goods_name,shop_price
	FROM (
        SELECT cat_id,MAX(shop_price)
        FROM ecs_goods
        GROUP BY cat_id
    	) temp , ecs_goods
	WHERE temp.cat_id = ecs_goods.cad_id AND temp.max_price = ecs_goods.shop_price
```



## ALL 和 ANY



- 显示工资比部门30的所有员工的工资高的员工的姓名、工资、部门号



> ALL和ANY关键字

```mysql
SELECT ename,sal,deptno
	FROM emp
	WHERE sal > ALL (
			SELECT sal
				FROM emp
				WHERE deptno = 30
			);
-- 可以这样写
SELECT ename,sal,deptno
	FROM emp
	WHERE sal > ( SELECT MAX(sal)
					FROM emp
					WHERE deptno = 30
			);


SELECT ename,sal,deptno
	FROM emp
	WHERE sal > ANY(SELECT sal
					FROM emp
					WHERE deptno = 30
			);
			
```

## 多列子查询

- 如何查询与SMITH的部门和岗位完全相同的所有雇员（并且不包含SMITH本人）



```mysql
-- 如何查询与SMITH的部门和岗位完全相同的所有雇员（并且不包含SMITH本人）

-- 分析：1. 得到SMITH的部门和岗位
SELECT deptno ,job
	FROM emp
	WHERE ename = 'SMITH'
-- 分析：2. 把上面的查询当做子查询来使用，并且使用多列子查询的语法进行匹配
SELECT * 
	FROM emp
	WHERE (deptno , job) = (
		SELECT deptno ,job
		FROM emp
		WHERE ename = 'ALLEN'
		)AND ename != 'ALLEN';

SELECT * FROM student
	WHERE(math,english,chinese) = (SELECT math,english,chinese
	FROM student
	WHERE `name` = '宋江');
```



## 练习



- 查找每个部门工资高于本部门平均工资的人的资料
- 这里要用到数据查询的小技巧，把一个子查询当做一个临时表来使用



```mysql
-- 查找每个部门 工资高于 本部门平均工资 的人的资料
-- 这里要用到数据查询的小技巧，把一个子查询当做一个临时表来使用
/*
	1. 分析：先得到每个部门的部门号和对应的平均工资
	2. 查询每个部门平均工资的子表
		平均工资怎么查：AVG(sal)
	3. 查询到带有 部门平均工资的子表后，将其作为子查询临时表使用
*/

SELECT deptno,AVG(sal) AS avg_sal
	FROM emp
	GROUP BY deptno
	
SELECT ename,sal,avg_sal,emp.deptno
	FROM emp,(SELECT deptno,AVG(sal) AS avg_sal
				FROM emp
				GROUP BY deptno) AS temp
	WHERE emp.deptno = temp.deptno AND emp.sal > temp.avg_sal

-- 查询每个部门工资最高的人的详细信息
SELECT ename,sal,max_sal,emp.deptno
	FROM emp,(SELECT deptno,MAX(sal) AS max_sal
				FROM emp
				GROUP BY deptno) AS temp
	WHERE emp.deptno = temp.deptno AND emp.sal = temp.max_sal;
	


-- 显示每个部门的信息(包括 部门名 编号 地址)和人员数量 

-- silu
-- 1. 信息来自dept表
-- 2. 

SELECT dname,deptno,loc FROM dept

SELECT COUNT(*),deptno
	FROM emp
	GROUP BY deptno;
	
SELECT dname,dept.deptno,loc,tmp.per_num
	FROM dept,(
		SELECT COUNT(*) AS per_num ,deptno
		FROM emp
		GROUP BY deptno
		) tmp
		WHERE tmp.deptno = dept.deptno
		
-- 还有一种写法，tab.* 表示将该表所有列都显示出来
-- 多表查询中，当多个表的列不重复时，才可以直接写列名
SELECT tmp.* , dname , loc
	FROM dept,(
		SELECT COUNT(*) AS per_num ,deptno
		FROM emp
		GROUP BY deptno
		) tmp
		WHERE tmp.deptno = dept.deptno
```





# 表复制和去重



## 复制



```mysql
-- 表的复制
-- 为了对某个SQL语句进行效率测试，我们需要海量数据时，可以使用此法为表创建海量数据
CREATE TABLE my_tab01
	( 	id INT,
		`name` VARCHAR(32),
		sal DOUBLE,
		job VARCHAR(32),
		deptno INT);
DESC my_tab01;
SELECT * FROM my_tab01;

-- 如何自我复制
-- 1. 先把emp表的记录复制到my_tab01
INSERT INTO my_tab01
	(id,`name`,sal,job,deptno)
	SELECT empno,ename,sal,job,deptno FROM emp;
	
-- 2.自我复制
INSERT INTO my_tab01
	SELECT * FROM my_tab01;
	
SELECT COUNT(*) FROM my_tab01;
```



## 去重

```mysql
-- 3. 考虑去重问题
/*
	思路
	1. 先创建一张临时表my_tmp,该表的结构和my_tab02一样
	2. 把my_tmp的记录通过distinct关键字处理后，把记录拷贝到my_tmp
	3. 清除掉my_tab02 记录
	4. 把my_tmp 表的记录复制到my_tab02
	5. drop临时表my_tmp
*/
-- 创建结构和tab表一致的tmp表
CREATE TABLE my_tmp LIKE my_tab02
-- 将tab表中的所有行插入到temp表
INSERT INTO my_tmp
	SELECT DISTINCT * FROM my_tab02;
-- 验证tmp表
SELECT * FROM my_tmp;
-- 删除tab表中元素
DELETE FROM my_tab02;
-- 插入tmp表到tab表中
INSERT INTO my_tab02
	SELECT * FROM my_tmp;
-- 删除tmp表
DROP TABLE my_tmp;
-- 验证tab表
SELECT * FROM my_tab02
```



## 合并

有时在实际应用中，为了合并多个select语句的结果，可以使用集合操作符号union，union all

**union.sql**



1. UNION ALL

该操作符用于取得两个结果集的并集，当使用该操作符时不会取消重复行。

`select ename,sal,job from emp where sal>2500 union select ename,sal,job from emp where job='MANAGER'` 



```mysql
-- 合并查询
select ename,sal,job 
from emp 
where sal > 2500;

select ename,sal,job 
from emp 
where job='MANAGER';

-- union all 就是将两个查询结果合并，不会去重

select ename,sal,job 
from emp 
where sal > 2500 UNION ALL
select ename,sal,job 
from emp 
where job='MANAGER';

-- union 会去重
select ename,sal,job 
from emp 
where sal > 2500 UNION
select ename,sal,job 
from emp 
where job='MANAGER';
```







# MySQL 表外连接

列出部门名称和这些部门的员工名称和工作，同时要求显示出那些没有员工的部门

- 外连接
  1. 左外连接（如果左侧的表完全显示我们就说是左外连接）
  2. 右外连接（如果右侧的表完全显示我们就说是右外连接）

为了讲清楚我们举例说明



```mysql
-- 外连接




SELECT dname,ename,job
	FROM emp,dept
	WHERE emp.deptno = dept.deptno
	ORDER BY dname

SELECT * FROM dept;
SELECT * FROM emp;

-- 创建stu
CREATE TABLE stu(
	id INT,
	`name` VARCHAR(32));

INSERT INTO stu VALUES(1, 'jack'),(2, 'tom'),(3, 'kitty'),(4, 'nono');
SELECT * FROM stu;
-- 创建exam
CREATE TABLE exam(
	id INT,
	grade INT);

INSERT INTO exam VALUE(1,56),(2,76),(11,8);
SELECT * FROM exam;


-- 使用左外连接 显示所有人的成绩，如果没有成绩，也要显示该人的姓名和id，成绩显示为空

SELECT `name`,stu.id,grade
	FROM stu,exam
	WHERE stu.id = exam.id;
SELECT `name`,stu.id,grade
	FROM stu left join exam
	on stu.id = exam.id;

-- 右连接（显示所有成绩，如果没有名字匹配，显示空）
SELECT `name`,stu.id,grade
	FROM stu right join exam
	on stu.id = exam.id;
	
-- 列出部门名称和这些部门的员工名称和工作，同时要求显示出那些没有员工的部门

SELECT dept.dname,emp.ename,emp.job
	FROM dept left join emp
	on emp.deptno = dept.deptno

-- 右连接

SELECT dept.dname,emp.ename,emp.job
	FROM emp right join dept
	on emp.deptno = dept.deptno
	
```



# MySQL约束

**约束**用于确保数据库的数据满足特定的商业规则

在MySQL中，约束包括`not null`, `unique`,`primary key`,`foreign key`和`check`





## PRIMARY KEY 主键



```mysql
CREATE TABLE t17
	(id INT PRIMARY KEY,
	`name` VARCHAR(32),
	email VARCHAR(32));

INSERT INTO t17
	VALUES(1,'jackie','jackie@icloud.com');
	
INSERT INTO t17
	VALUES(2,'tom','tom@icloud.com');
	
INSERT INTO t17
VALUES(1,'hsp','hsp@icloud.com');
/* 
	INSERT INTO t17
		VALUES(1,'hsp','hsp@icloud.com')
		> 1062 - Duplicate entry '1' for key 't17.PRIMARY'
*/
```



- 主键细节

1. primary key 不可以重复
2. primary key 不可以为空（null）
3. 一张表最多只能有一个主键，但可以是复合主键

主键的指定方式有两种

第一种

```mysql
CREATE TABLE t18
	(id INT,
	`name` VARCHAR(32),
	email VARCHAR(32))
	PRIMARY KEY (id,`name`); -- 这里就是复合主键
```



第二种:复合主键



```mysql
CREATE TABLE t18
	(id INT,
	`name` VARCHAR(32),
	email VARCHAR(32),
	PRIMARY KEY (id,`name`)
	); -- 这里就是复合主键
```

此时主键为id+name



使用`desc 表名`，可以看到主键的情况

在实际开发中，每个表往往都有主键

因为要有主键来标识唯一项





## NOT NULL 非空

不做讲解，只是一个约束





## UNIQUE 唯一



```mysql
CREATE TABLE t20
	(id INT UNIQUE, -- 表示id列是不可以重复的
	`name` VARCHAR(32),
	email VARCHAR(32)
	); 

INSERT INTO t20
	VALUES(1,'jack','jack@icloud.com');
	
INSERT INTO t20
	VALUES(1,'tom','tom@icloud.com');
	
SELECT * FROM t20;

-- unique使用细节
-- 如果没有指定 not null,则unique的字段可以有多个null
INSERT INTO t20
	VALUES(NULL,'tom','tom@icloud.com');
SELECT * FROM t20;

-- 如果一个列（字段），是unique not null 使用效果类似primary key
-- 一张表可以有多个unique字段

CREATE TABLE t22
	(id INT UNIQUE, -- 表示id列是不可以重复的
	`name` VARCHAR(32) UNIQUE, -- 表示name列是不可以重复的
	email VARCHAR(32)
	); 
desc t22
```



## FOREIGN KEY 外键

用于定义主表和从表之间的关系，外键约束要定义在从表上，主表则必须有主键约束或是unique约束，当定义外键约束后，要求外键列数据必须在主表的主键列存在或是为null（学生/班级）



如果我们要求，每个学生所在的班级号class_id是存在的班级编号

就可以把Class_id做成外键约束





```mysql
FOREIGN KEY (本表字段名) REFERENCES
(主表名)（主键名或unique字段名）
```

一旦建立了主外键的关系，数据就不能随意删除了

```mysql
-- 外键演示

CREATE TABLE my_class (
	id INT PRIMARY KEY,
	class_name VARCHAR(32),
	address VARCHAR(32)
	);


SELECT * FROM my_class;

CREATE TABLE my_stu(
	id INT PRIMARY KEY,
	`name` VARCHAR(32) NOT NULL DEFAULT '',
	class_id INT, -- 学生所在班级的编号
	FOREIGN KEY(class_id) REFERENCES my_class(id)
	);


-- testing datas

INSERT INTO my_class
	VALUES(100,'java01','北京'),(200,'web22','上海');
	
INSERT INTO my_stu
	VALUES(1,'tom',100),(2,'jack',200);
	
INSERT INTO my_stu
	VALUES(3,'mary',300);

SELECT * FROM my_stu;

	
/*
INSERT INTO my_stu
	VALUES(3,'mary',300)
> 1452 - Cannot add or update a child row: a foreign key constraint fails (`jl_db02`.`my_stu`, CONSTRAINT `my_stu_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `my_class` (`id`))
> 时间: 0.002s
*/
```





## CHECK 检查

用于强制行数据必须满足的条件，假定在sal列上定义了



```mysql
CREATE TABLE t23(
id INT PRIMARY KEY,
`name` VARCHAR(32),
sex VARCHAR(6) CHECK (sex IN('man','woman')),
sal DOUBLE CHECK (sal>1000 and sal <2000)
);

INSERT INTO t23
VALUES(1,'jack','mid',1);
SELECT * FROM t23;
```



## 商店表设计



```mysql
/*
现有一个商店表的数据库shop_db,记录客户机器购物情况，由下面三个表组成:商品goods(goods_id,goods_name,unitprice,category,provider)
客户customer(customer_id,name,address,emal,sex,card_id)
购买purchase(order_id,customer_id,goods_id,nums)

*/
-- 建表 在定义中要求声明 进行合理设计
-- 每个表的主外键 
-- 客户的姓名not null 
-- 电邮不能重复 
-- 客户的性别 
-- 单价在之间check

CREATE TABLE goods(
	goods_id INT PRIMARY KEY DEFAULT(0),
	goods_name VARCHAR(64) NOT NULL,
	unitprice DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK(unitprice >=1.0 AND unitprice <=9999.99),
	category VARCHAR(64) NOT NULL DEFAULT '',
	provider VARCHAR(64) NOT NULL DEFAULT ''
);
-- 客户customer(customer_id,name,address,emal,sex,card_id)

CREATE TABLE customer(
	customer_id CHAR(8) PRIMARY KEY,
	`name` VARCHAR(64) NOT NULL DEFAULT '',
	address VARCHAR(64) NOT NULL DEFAULT '',
	email VARCHAR(64) UNIQUE NOT NULL,
	sex ENUM('男','女') NOT NULL, -- 枚举类型，是生效的
	card_id CHAR(18) UNIQUE
	);
	
-- 购买purchase(order_id,customer_id,goods_id,nums)
CREATE TABLE pruchase(
order_id INT PRIMARY KEY,
customer_id CHAR(8) NOT NULL DEFAULT'',
goods_id INT NOT NULL DEFAULT(0),
nums INT NOT NULL DEFAULT(0),
FOREIGN KEY(customer_id) REFERENCES customer(customer_id),
FOREIGN KEY(goods_id) REFERENCES goods(goods_id)
);
```



- 注意

1. 主键和外键的类型要一致，包括约束；设置外键时应该把主键设置好
2. 如果可能请尽可能将字段设置非空并且设置默认值（字符串为`' '` INT为0 等）
3. 在`unitprice`中使用了`decimal`类型，而不是double，因为double后面是一大串数字
4. `sex`字段使用了枚举类型（`ENUM('1','2')`） 
5. `VARCHAR`类型应足够宽裕





## 自增

我们希望在添加某个表时，自动为某字段的列增长

`字段名 整形 primary key auto increment`



```mysql
CREATE TABLE t24
	(id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(32) not NULL DEFAULT '',
	`name` VARCHAR(32) not NULL DEFAULT ''
	);

desc t24;


INSERT INTO t24
VALUES(NULL,'tom@qq.com','tom');

SELECT * FROM t24;

INSERT INTO t24
(email,`name`)
VALUES('qwq@qq.com','qwq');

CREATE TABLE t25
	(id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(32) not NULL DEFAULT '',
	`name` VARCHAR(32) not NULL DEFAULT ''
	);

alter table t25 auto_increment = 100;
INSERT INTO t25
VALUES(NULL,'tom1@qq.com','tom1');

SELECT * FROM t25;
```







- 细节

1. 一般来说自增长是和primary key配合使用的

2. 自增长也可以单独使用（但是需要配合一个unique）

3. 自增长修饰的字段为整数型（虽然小数也可以但是非常少这样使用 不建议）

4. 自增长默认从1开始，你可以通过如下指令修改

   `alter table tablename auto_increment = xxx;`

5. 如果你添加数据时，给自增长字段（列）指定的有值，则以指定的值为准

   也就是如果再插入数据时，指定字段为666，下一次指定为null后，下次插入的字段为667



# MySQL索引

说起提高数据库性能，就要提到索引，不用加内存，不用改程序，不用调SQL，查询速度可能提高千百倍



## 索引的原理



当我们没有索引的时候，查询语句会进行全表扫描，



如果我们比较了30次，覆盖的表的范围为2^30



引入排序二叉树来解决这个问题

排序二叉树：

（原流程图已移除）

索引的代价：

1. 磁盘占用
2. 如果对表进行`DML`(`Delete Modify Insert`)

那么为什么我们还要用索引呢 因为在实际项目中，`select`占了90%的使用场景



## 索引的类型

1. 主键索引，主键自动的为主索引（类型`primary key`）

2. 唯一索引（`unique`）

3. 普通索引（`index`）

4. 全文索引（`FULLTEXT`）适用于`MyISAM`

   开发中考虑使用：全文搜索`Solr`和`ElasticSearch`(ES)



```mysql
-- 演示MySQL索引的使用
-- 创建索引
CREATE TABLE t251(
	id INT,
	`name` VARCHAR(32)
);

SHOW INDEX FROM t251;

-- 添加索引
-- 创建 唯一 索引 索引名 在 表名的 字段 
CREATE UNIQUE INDEX index_name ON t251 (id)

CREATE INDEX id_index on t251 (id);

-- 添加普通索引方式2
-- 修改 表 表名 添加 索引 索引名 字段
ALTER TABLE t25 ADD INDEX id_index (id)

-- 添加主键索引
CREATE TABLE t26(
	id INT,
	`name` VARCHAR(32)
);
ALTER TABLE t26 ADD PRIMARY KEY (id)

SHOW INDEX FROM t26

DROP INDEX id_index on t251

ALTER TABLE t26 DROP PRIMARY KEY



-- 修改索引 先删除再添加新的索引

-- 查询索引

SHOW INDEX FROM t251;
SHOW INDEXES FROM t251;

SHOW KEYS FROM t251;

desc t251;


```





## 练习



```mysql

CREATE TABLE `order1`
(
	id INT PRIMARY KEY,
	order_name VARCHAR(64) NOT NULL DEFAULT '',
	order_er VARCHAR(64) NOT NULL DEFAULT '',
	nums INT NOT NULL DEFAULT 0
);
CREATE INDEX id_index ON `order1` (id);

CREATE TABLE menu 
(
	id INT PRIMARY KEY,
	food_name VARCHAR(64) NOT NULL DEFAULT '',
	cooker VARCHAR(64) NOT NULL DEFAULT '',
	order_erid INT UNIQUE
);

ALTER TABLE menu ADD PRIMARY KEY (id);

SHOW INDEX FROM `order1`;
SHOW INDEX FROM menu;
```



## 使用场景

1. 较频繁的作为查询条件字段应该创建索引
2. 唯一性太差的字段不适合单独创建索引，即使作为频繁查询条件
3. 更新非常频繁的字段不适合创建索引
4. 不会出现在`WHERE`子句中字段不该创建索引





# MySQL事务

- 什么是事务

事务用于保证数据的一致性，它由一组相关的DML语句组成，该组的DML语句要么全部成功，要么全部失败，如：转账就要用事务来处理，用以保证数据的一致性。

- 事务和锁

当执行事务操作时（DML语句），MySQL会在表上加锁，防止其他用户修改表的数据，这对用户来讲是非常重要的。





- MySQL数据库控制台事务的几个重要操作（基本操作）
  1. `start transaction` --开始一个事务
  2. `savepoint` 保存点名 --设置保存点
  3. `rollback to` 保存点名 --回退事务
  4. `rollback` --回退全部事务
  5. `commit` -- 提交事务，所有的操作生效，不能回退



```mysql
-- 事务的一个重要的概念和具体操作
CREATE TABLE t27
(

id INT,
`name` VARCHAR(32)
);

START TRANSACTION;
-- 设置保存点
SAVEPOINT a
-- 执行DML操作
INSERT into t27
VALUES(100,'tom');
SELECT * FROM t27;

SAVEPOINT b

-- 执行dml操作
INSERT into t27
VALUES(200,'jack');
SELECT * FROM t27;

ROLLBACK TO a

ROLLBACK

-- 提交之前，在最后返回到a点，不能回到b点，如果在b点 则可以回到a点，
-- 在保存点a时还没有b保存点。
-- 如果没有提交，其他人无法看到这个数据，要提交之后才能看到

```





## 事务细节

1. 如果不开始事务，默认情况下，`dml`操作是自动提交的
2. 如果开始一个事务，你没有创建保存点，你可以执行`rollback`，默认就是回滚到事务开始的状态
3. 也可以在这个事务中（没有提交时）创建多个保存点，
4. 你可以在事务没有提交前，选择回退到哪个保存点
5. MySQL的事务机制需要`innodb`的存储引擎还可以使用`myisam`不行
6. 开始一个事务`start transaction,setautocommit=off;`



## 事务隔离级别

1. 多个连接开启各自事务操作数据库中数据时，数据库系统要负责隔离操作，以保证各个连接在获取数据时的准确性
2. 如果不考虑隔离性，可能会引发如下问题
   1. 脏读（dirty read）：当一个事务读取另一个事务尚未提交的修改时，产生脏读
   2. 不可重复读（nonrepeatable read）：同一查询在同一事务中多次进行，由于提交事务所做的修改每次返回不同的结果集，此时发生不可重复读
   3. 幻读（phantom read）：同一查询在同一事务中多次进行，由于其他提交事务所做的插入操作，每次返回不同的结果集，此时发生幻读



```mysql
-- 查看当前会话隔离级别
SELECT @@transaction_isolation;
-- 查看系统当前隔离级别
SELECT @@global.transaction_isolation;
-- 设置当前会话隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
-- 设置当前系统隔离级别[写上要设置的级别]
SET GLOBAL TRANSACTION ISOLATION LEVEL READ UNCOMMITTED; 
-- 一般情况下，默认隔离级别没有必要修改
-- 修改后需要重启数据库服务
```



- 事务的`ACID`特性

1. 原子性（Atomicity）

   原子性指事务是一个不可分割的工作单位，事务中的操作要么全部发生，要么全部都不发生

2. 一致性（Consistency）

   事务必须使数据库从一个一致性状态变换到另一个一致性状态

3. 隔离性（Isolation）

   事务的隔离性是多个用户并发访问数据时，数据库为每一个用户开启的事务，不能被其他事务的操作数据所干扰，多个并发事务之间要相互隔离

4. 持久性（Durability）

   持久性是指一个事物一旦被提交，他对数据库的改变就是永久性的，接下来即使数据库发生故障也不应该对其有任何影响

| MySQL隔离级别                | 脏读 | 不可重复读 | 幻读 | 加锁读 |
| ---------------------------- | ---- | ---------- | ---- | ------ |
| 读未提交（Read uncommitted） | ✅    | ✅          | ✅    | 不加锁 |
| 读已提交（Read committed）   | ❌    | ✅          | ✅    | 不加锁 |
| 可重复读（Repeatable read）  | ❌    | ❌          | ❌    | 不加锁 |
| 可串行化（Serializable）     | ❌    | ❌          | ❌    | 加锁   |

说明：✅可能出现，❌不会出现



# MySQL 表类型和存储类型

- 基本介绍

1. MySQL的表类型由存储引擎决定，主要包括MYISAM，innoDB，Memory
2. MySQL数据表主要支持有六种类型，分别是CSV，Memory，ARCHIVE，MRG_MYISAM，MYISAM，innoDB
3. 这六种又分为两类，一类是“事务安全型”，另一种是“非事务安全型”，只有innoDB是事务安全型，其余都是非事务安全型



`SHOW ENGINES;`运行此指令可以得到所有的事务类型



- 主要的存储引擎、表类型特点



| 特点           | MYISAM | InnoDB | Memory | Archive |
| -------------- | ------ | ------ | ------ | ------- |
| 批量插入的速度 | 高     | 低     | 高     | 非常高  |
| 事务安全       |        | 支持   |        |         |
| 全文索引       | 支持   |        |        |         |
| 锁机制         | 表锁   | 行锁   | 表锁   | 行锁    |
| 存储限制       | 没有   | 64TB   | 有     | 没有    |
| B树索引        | 支持   | 支持   | 支持   |         |
| 哈希索引       |        | 支持   | 支持   |         |
| 集群索引       |        | 支持   |        |         |
| 数据缓存       |        | 支持   | 支持   |         |
| 索引缓存       | 支持   | 支持   | 支持   |         |
| 数据可压缩     | 支持   |        |        | 支持    |
| 空间使用       | 低     | 高     | N/A    | 非常低  |
| 内存使用       | 低     | 高     | 中等   | 低      |
| 支持外键       |        | 支持   |        |         |



- 细节说明

1. MYISAM不支持事务，也不支持外键，但其访问速度快，对事务完整性没有要求。
2. InnoDB存储引擎提供了具有提交，回滚和崩溃恢复能力的事务安全。但是比起MYISAM存储引擎，InnoDB写的处理效率差一些并且会占用更多的磁盘空间以保留数据和索引。
3. MEMORY存储引擎使用存在内存中的内容来创建表。每个MEMORY表只实际对应一个磁盘文件。MEMORY类型的表访问的非常的快，因为他的数据是放在内存中，并且默认使用HASH索引，但是一旦服务关闭，表中的数据就会丢失掉，表的结构还在。



# 视图（View）

`emp`表的列信息很多，有些是个人重要信息比如（`sal`,`comm`,`mgr`,`hiredate`）如果我们希望某个用户只能查询emp表的（`empno`，`ename`，`job`，`deptno`） 信息 有什么办法？



- 基本概念

1. 视图是一个虚拟表，其内容由查询定义。同真实的表一样，视图也包含列，他的数据来自对应的真实表



## 指令



```mysql
-- 视图的使用
CREATE VIEW emp_view01
	AS
	SELECT empno,ename,job,deptno FROM emp;
	
-- 查看视图
DESC emp_view01;
SELECT * FROM emp_view01;
SELECT empno,job FROM emp_view01;

-- 查看创建视图的指令
SHOW CREATE VIEW emp_view01;

-- 删除视图
DROP VIEW emp_view01;
```



## 细节

1. 创建视图后，到数据库去看，对应视图只有一个视图结构文件
2. 视图的数据变化会影响到基表，反之亦然





# 实践

1. 安全：让用户查看自己需要的字段，不能查看保密的字段
2. 性能：将相关的表和字段组合到一起，避免使用JOIN查询数据
3. 灵活：旧表即将废弃，创建视图，映射到新建的表



```mysql
-- 视图的使用
CREATE VIEW emp_view01
	AS
	SELECT empno,ename,job,deptno FROM emp;
	
-- 查看视图
DESC emp_view01;
SELECT * FROM emp_view01;
SELECT empno,job FROM emp_view01;

-- 查看创建视图的指令
SHOW CREATE VIEW emp_view01;

-- 删除视图
DROP VIEW emp_view01;

-- 修改视图
UPDATE emp_view01
	SET job = 'MANAGER'
	WHERE empno = 7369;

SELECT * FROM emp;
SELECT * FROM emp_view01;

-- 修改基本表也会影响视图，不演示了。



-- 练习
-- 创建查询
SELECT empno,ename,dname,grade
	FROM emp,dept,salgrade
	WHERE emp.deptno = dept.deptno 
	AND (sal BETWEEN losal AND hisal)
-- 创建视图
CREATE VIEW emp_view03
	AS
	SELECT empno,ename,dname,grade
	FROM emp,dept,salgrade
	WHERE emp.deptno = dept.deptno 
	AND (sal BETWEEN losal AND hisal);
-- 查询
DESC emp_view03;

SELECT * FROM emp_view03;
```



# MySQL用户管理

MySQL中的用户，都存储在系统数据库mysql的user表中



其中user表的重要字段说明

1. host 允许登录的位置
2. user 用户名
3. authenication_string 密码 是通过mysql的password函数加密后的密码



做项目开发时，根据不同的开发人员，赋给他相应的MySQL操作权限

所以根据不同需求创建不同的用户赋给相应人员使用



```mysql
CREATE USER 'jason'@'localhost' IDENTIFIED BY '111111';

SELECT * FROM mysql.`user`;


DROP USER 'jason'@'localhost';

-- 登录

-- root用户修改 jason@localhost = passwod('123456') 是可以成功的


```

## 权限管理



**给用户授权 Grant**

说明：

- `.` 代表本系统中的所有数据库的所有对象（表 视图 存储过程）

- `库.`表示某个数据库中的所有数据对象（表 视图 存储过程）

identified by 可以省略，也可以写出

1. 如果用户存在，就是修改该用户的密码
2. 如果该用户不存在就是创建该用户

**回收权限 Revoke**

**权限生效 Flush**



```mysql
-- 练习
CREATE USER 'sql1'@'localhost' IDENTIFIED BY '123456';
-- 使用root用户创建testdb，表news
CREATE TABLE news(
id INT,
content VARCHAR(32)
);
INSERT INTO news VALUES(100,'北京');
-- 给用户分配news表和添加数据的权限
GRANT SELECT , INSERT
	ON jl_db02.news
	TO 'sql1'@'localhost'

GRANT UPDATE
	ON jl_db02.news
	TO 'sql1'@'localhost'
	
-- 修改sql的密码为sql1
SET PASSWORD FOR 'sql1'@'localhost' = PASSWORD('sql1'); -- 已过时

ALTER USER 'sql1'@'localhost' IDENTIFIED BY 'sql1';

-- 修改授权
REVOKE SELECT , UPDATE,INSERT ON jl_db02.news FROM'sql1'@'localhost';
REVOKE ALL ON jl_db02.news FROM'sql1'@'localhost';
-- 刷新
FLUSH PRIVILEGES;

```



## 细节



可以指定IP：`'xxx'@'192.168.1.%'`

删除用户时，如果host不是%需要明确指定host值





# 练习



```mysql

-- 查看dept表和emp表的结构
DESC dept;
DESC emp;
-- 查询表
SELECT * FROM dept;
SELECT * FROM emp;

-- 显示所有部门名称
SELECT dname FROM dept;

-- 显示所有雇员名及其全年收入 13月（工资+补助），并指定列别名为年收入
SELECT ename ,sal*13 AS sal_year FROM emp;

-- 显示工资超过2850的雇员姓名和工资
SELECT ename,sal FROM emp
	WHERE sal>2850;
	
-- 显示工资不在1500到2850之间的所有雇员名及工资
SELECT ename,sal FROM emp
	WHERE sal NOT BETWEEN 1500 AND 2850;
	
-- 显示编号为7566的雇员姓名及所在部门编号
SELECT ename,deptno FROM emp
	WHERE empno = 7566;
	
-- 显示部门10和30中工资超过1500的雇员名及工资
SELECT ename,sal,deptno FROM emp
	WHERE deptno IN (10,30) AND sal >1500

-- 显示无管理者的雇员名及岗位
SELECT ename,job FROM emp
	WHERE mgr IS NULL

-- 显示在1991年2月1日到1991年5月1日之间雇佣的雇员名，岗位以及雇佣日期，并以雇佣日期排序
SELECT ename,job,hiredate FROM emp
	WHERE hiredate
	BETWEEN '1991-02-01' AND '1991-05-01'
	ORDER BY hiredate
	
-- 显示获得补助的所有雇员名工资及补助，并以工资降序排序
SELECT ename,sal,comm FROM emp
WHERE comm IS NOT NULL
ORDER BY sal DESC
```



```mysql
-- 1. 选择部门30中的所有员工
SELECT * FROM emp
	WHERE deptno = 30;
-- 2. 列出所有办事员(CLERK)的姓名，编号和部门编号
SELECT ename,empno,deptno FROM emp
	WHERE job='CLERK';
-- 3. 找出佣金高于薪金的员工
SELECT ename,sal,comm FROM emp
	WHERE comm > sal ;
-- 4. 找出佣金高于薪金60%的员工
SELECT ename FROM emp
	WHERE comm > sal*0.6;
-- 5. 找出部门10中所有经理(MANAGER)和部门20中所有办事员(CLERK)的详细资料
SELECT * FROM  emp
	WHERE (deptno = 10 AND job = 'MANAGER')
	OR (deptno = 20 AND job = 'CLERK');
-- 6. 找出部门10中所有经理(MANAGER),部门20中所有办事员(CLERK),还有既不是经理又不是办事员但其薪金大于或等于2000的所有员工的详细资料
SELECT * FROM  emp
	WHERE (deptno = 10 AND job = 'MANAGER')
	OR (deptno = 20 AND job = 'CLERK')
	OR (job NOT IN ('MANAGER','CLERK' )AND sal >= 2000);
-- 7. 找出收取佣金的员工的不同工作
SELECT DISTINCT job FROM emp
	WHERE comm IS NOT NULL AND comm !=0;
-- 8. 找出不收取佣金或收取的佣金低于100的员工
SELECT * FROM emp
	WHERE comm IS NULL
	OR comm BETWEEN 0 AND 100;
	
-- 9. 找出各月份倒数第3天受雇的所有员工
SELECT * FROM emp
	WHERE DAY(hiredate) = DAY(LAST_DAY(hiredate)) - 2;
-- 10. 找出早于12年前受雇的员工
SELECT * FROM emp
	WHERE hiredate < DATE_SUB(NOW(), INTERVAL 12 YEAR);
-- 11. 以首字母小写的方式显示所有员工的姓名

-- 以首字母小写的方式显示所有emp表的姓名
# 拼接
SELECT 
	CONCAT(LCASE(SUBSTRING(ename,1,1)) , SUBSTRING(ename,2,7))
	FROM emp;
# 替换
SELECT
	REPLACE(ename,SUBSTRING(ename,1,1),LCASE(SUBSTRING(ename,1,1))  )
	FROM emp;

-- 12. 显示正好为5个字符的员工的姓名
SELECT ename FROM emp
	WHERE LENGTH(ename) = 5;
```

```mysql
-- 13. 显示不带有"R"的员工的姓名
SELECT * FROM emp
	WHERE  INSTR(ename, 'R') = 0;
-- 14. 显示所有员工姓名的前三个字符
SELECT LEFT(ename, 3) FROM emp
-- 15. 显示所有员工的姓名，用a替换所有"A"
SELECT REPLACE(ename, 'A', 'a') FROM emp
-- 16. 显示满10年服务年限的员工的姓名和受雇日期
SELECT ename,hiredate FROM emp
	WHERE hiredate < DATE_ADD(hiredate, INTERVAL 10 year)
-- 17. 显示员工的详细资料，按姓名排序
SELECT * FROM emp
	ORDER BY ename
-- 18. 显示员工的姓名和受雇日期，根据其服务年限，将最老的员工排在最前面
SELECT ename,hiredate FROM emp
	ORDER BY hiredate
-- 19. 显示所有员工的姓名、工作和薪金，按工作降序排序，若工作相同则按薪金排序
SELECT ename, job, sal
	FROM emp
	ORDER BY job DESC, sal ASC;   -- job降序，job相同则sal升序
-- 20. 显示所有员工的姓名、加入公司的年份和月份，按受雇日期所在月排序，若月份相同则将最早年份的员工排在最前面
SELECT ename,YEAR(hiredate),MONTH(hiredate) FROM emp
	ORDER BY MONTH(hiredate) ,YEAR(hiredate) ASC;
-- 21. 显示在一个月为30天的情况所有员工的日薪金，忽略余数
SELECT ename, sal DIV 30 AS day_sal FROM emp
-- 22. 找出在(任何年份的)2月受聘的所有员工
SELECT * FROM emp
	WHERE MONTH(hiredate) = 2;
-- 23. 对于每个员工，显示其加入公司的天数
SELECT ename, DATEDIFF(NOW(),hiredate) FROM emp
	
-- 24. 显示姓名字段的任何位置包含"A"的所有员工的姓名
SELECT ename FROM emp
	WHERE  INSTR(ename, 'A') !=0
-- 25. 以年月日的方式显示所有员工的服务年限（大概）
SELECT 
    ename,
    hiredate,
    CONCAT(
        TIMESTAMPDIFF(YEAR, hiredate, CURDATE()), '年 ',
        TIMESTAMPDIFF(MONTH, hiredate, CURDATE()) % 12, '月 ',
        TIMESTAMPDIFF(DAY, 
            DATE_ADD(hiredate, 
                INTERVAL TIMESTAMPDIFF(MONTH, hiredate, CURDATE()) MONTH
            ), 
            CURDATE()
        ), '日'
    ) AS 服务年限
FROM emp
ORDER BY hiredate;
```



```mysql
-- 7. 根据：emp员工表，dept部门表，工资 = 薪金 + 佣金 写出正确SQL homework04.sql
-- (1). 列出至少有一个员工的所有部门
SELECT COUNT(*) AS C,deptno
	FROM emp
	GROUP BY deptno
	HAVING C>1
-- (2). 列出薪金比“SMITH”多的所有员工	
SELECT * 
	FROM emp
	WHERE sal >(
		SELECT sal
		FROM emp
		WHERE ename = 'SMITH')
-- (3). 列出受雇日期晚于其直接上级的所有员工     empno
SELECT worker.ename AS '员工名',
	worker.hiredate AS '入职时间',
	leader.ename AS '上级名' ,
	worker.hiredate AS '入职时间'
		FROM emp worker ,emp leader
		WHERE worker.hiredate >leader.hiredate
		AND worker.mgr = leader.empno
-- (4). 列出部门名称和这些部门的员工信息，同时列出那些没有员工的部门
SELECT dname,emp.*
	FROM dept LEFT JOIN emp 
	ON dept.deptno= emp.deptno
-- (5). 列出所有“CLERK”（办事员）的姓名及其部门名称
SELECT ename,dname,job
	FROM emp ,dept
	WHERE job = 'CLERK'
-- (6). 列出最低薪金大于1500的各种工作
SELECT job FROM emp
	GROUP BY job
	HAVING MIN(sal) <1500
-- (7). 列出在部门“SALES”（销售部）工作的员工的姓名
SELECT ename,deptno FROM emp
	WHERE deptno = 30
-- (8). 列出薪金高于公司平均薪金的所有员工
SELECT * FROM emp
	WHERE sal > (SELECT AVG(sal) FROM emp)
	
```



```mysql
-- =============================================
-- homework04.sql
-- 根据：emp员工表，dept部门表，工资 = 薪金 + 佣金
-- =============================================
SELECT * FROM emp

-- (9) 列出与"SCOTT"从事相同工作的所有员工。
SELECT * FROM emp
	WHERE job = (SELECT job FROM emp
	WHERE ename = 'SCOTT')

-- (10) 列出薪金高于在部门30工作的所有员工的薪金的员工姓名和薪金。
SELECT ename,sal 
	FROM emp
	WHERE sal > (
		SELECT MAX(sal) 
		FROM emp
		WHERE deptno = 30
	)

-- (11) 列出在每个部门工作的员工数量、平均工资和平均服务期限。
SELECT COUNT(*) AS '部门员工数量',
deptno,
AVG(sal) AS '部门平均工资' ,
AVG(dateDIFF(NOW(),hiredate) )
	FROM emp
	GROUP BY deptno

-- (12) 列出所有员工的姓名、部门名称和工资。
SELECT ename,dept.dname,sal FROM emp,dept

-- (13) 列出所有部门的详细信息和部门人数。

	
	SELECT * FROM dept,(SELECT COUNT(*) AS c ,deptno
	FROM emp
	GROUP BY deptno
	)tmp
	WHERE dept.deptno = tmp.deptno

-- (14) 列出各种工作的最低工资。
SELECT MIN( sal) , job
	FROM emp
	GROUP BY job
-- (15) 列出MANAGER（经理）的最低薪金。
SELECT MIN(sal) FROM emp
	WHERE job = 'MANAGER'

-- (16) 列出所有员工的年工资，按年薪从低到高排序。
SELECT ename,(sal+IFNULL(comm,0))*12 AS year_sal 
	FROM emp
	ORDER BY year_sal ASC; 
```





```mysql
-- =============================================
-- homework05.sql
-- 系、班级、学生 数据库
-- =============================================

-- (1) 建表
-- 系DEPARTMENT（系号departmentid，系名deptname）
CREATE TABLE department(
    departmentid VARCHAR(10) NOT NULL PRIMARY KEY,
    deptname VARCHAR(64) NOT NULL UNIQUE
);

-- 班CLASS（班号classid，专业名subject，系名deptname，入学年份enrollment，人数num）
CREATE TABLE class(
    classid VARCHAR(10) NOT NULL PRIMARY KEY,
    `subject` VARCHAR(64) NOT NULL,
    deptname VARCHAR(64) NOT NULL,
    enrollment YEAR NOT NULL,  -- 改为 YEAR 类型，只存年份
    num INT NOT NULL DEFAULT 0,
    FOREIGN KEY (deptname) REFERENCES department(deptname)
);

-- 学生STUDENT（学号studentid，姓名name，年龄age，班号classid）
CREATE TABLE student(
    studentid VARCHAR(10) NOT NULL PRIMARY KEY,
    `name` VARCHAR(64) NOT NULL,  -- 题目要求姓名不能为空，去掉 DEFAULT
    age INT NOT NULL,
    classid VARCHAR(10) NOT NULL,  -- 改为 VARCHAR(10)，与 class 表一致
    FOREIGN KEY (classid) REFERENCES class(classid)
);

-- =============================================
-- (2) 插入数据
-- =============================================

-- DEPARTMENT
INSERT INTO department VALUES
('001', '数学'),
('002', '计算机'),
('003', '化学'),
('004', '中文'),
('005', '经济');

-- CLASS
INSERT INTO class VALUES
('101', '软件', '计算机', 1995, 20),
('102', '微电子', '计算机', 1996, 30),
('111', '无机化学', '化学', 1995, 29),
('112', '高分子化学', '化学', 1996, 25),
('121', '统计数学', '数学', 1995, 20),
('131', '现代语言', '中文', 1996, 20),
('141', '国际贸易', '经济', 1997, 30),
('142', '国际金融', '经济', 1996, 14);

-- STUDENT
INSERT INTO student VALUES
('8101', '张三', 18, '101'),
('8102', '钱四', 16, '121'),
('8103', '王玲', 17, '131'),
('8105', '李飞', 19, '102'),
('8109', '赵四', 18, '141'),
('8110', '李可', 20, '142'),
('8201', '张飞', 18, '111'),
('8302', '周瑜', 16, '112'),
('8203', '王亮', 17, '111'),
('8305', '董庆', 19, '102'),
('8409', '赵龙', 18, '101'),
('8510', '李丽', 20, '142');












-- (3) 完成以下查询功能

-- 3.1 找出所有姓李的学生。
SELECT * FROM student
WHERE LEFT(student.name, 1) = '李';
-- 3.2 列出所有开设超过1个专业的系的名字。
SELECT * FROM department;
SELECT * FROM class;

SELECT deptname,COUNT(`subject`) AS c FROM class
GROUP BY deptname
HAVING c>1;
-- 3.3 列出人数大于等于30的系的编号和名字。
SELECT classid,deptname FROM class
WHERE num >= 30;

-- (4) 学校又新增加了一个物理系，编号为006
INSERT INTO department 
VALUES ('006','物理');

-- (5) 学生张三退学，请更新相关的表
DELETE FROM student WHERE name = '张三';

```

