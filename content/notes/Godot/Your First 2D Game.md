---
date: 2026-08-24
description: 跟着 Godot 官方 2D 入门教程做一个可玩的 Dodge the Creeps 小游戏。
---

# GettingStarted

这是GodotDocs中的官方入门级教程，帮助开发者快速入门Godot。

在一切开始之前的一些概念：

首先是官方编程语言`GDS`（`GoDotScript`）： 官方Godot编程语言，语言写法参考了Python的缩进式，而Java的大括号编程。缩进为区分层级的关键，但也因此省略了很多麻烦的符号。

然后是Godot中的四个核心概念

1. 节点（`Node`）： GDS采用了面向对象编程，内置了非常多的节点供玩家使用，所有节点的基类为Node，子类则有诸如Node3D、CanvasLayer等节点。
2. 场景（`Scene`）：在Godot中，所有能够重复使用的内容都可以拆分为场景，（组件）界面的菜单，一个房子，一个敌人等。在此教程中，场景主要分为（主场景、玩家、敌人、HUD）。你可以将玩家场景放到关卡场景下。场景在保存完毕后可以复制到其他场景中使用，称之为实例化。
3. 场景树（`SceneTree`）：由于场景是节点树，因此场景树也是节点树，游戏的所有场景都汇聚在场景树中。
4. 信号（`Signal`）：节点在发生某些事件时发出信号，此功能无需在代码中硬连接节点就能让他们互相通信。例如，按钮在按下时会发出信号，启动游戏或退出游戏等。





## Godot 的设计理念

Godot凭借其灵活的场景系统和节点层次结构，将面向对象设计作为其核心。 它试图远离严格的编程模式，以提供直观的方式来构建游戏。

不过Godot也提倡把继承和组件两种概念结合起来。

例如：你可以创建一个实体`entity`。将`enemy`添加了一些敌对单位才会拥有的组件，这样你就把这个单位做成了敌人。而将`NPC`添加友方单位才会拥有的组件，这个单位就是友方。而为玩家`entity`添加多种角色`Character`，除了把这个单位做成玩家之外，还需要做一些继承自玩家之外的组件，以让其成为魔术师`Magician`，战士`Warrior`等等。



值得注意的是：例如

`Sprite2D` 同时 `Node2D`、`CanvasItem` 和 `Node`。它具有其三个父类的所有属性和功能，例如变换或绘制自定义形状和使用自定义着色器进行渲染的能力。





>  Godot本身也是一款Godot游戏（Godot Engine由Godot编写而成）





其他具体概念参考[GodotDocs](https://docs.godotengine.org/zh-cn/4.x/getting_started/introduction/index.html)



了解了基本的概念，我们就可以跟着教程去制作我们的第一个Godot游戏了。





# Your first 2D game



这是一个玩家操控角色，躲避从四处出现的敌人的游戏。

1. 首先打开Godot，新建一个项目。
2. 下载Godot官方提供的资源包，并且解压到根目录
3. 打开项目，在左上角项目设置中找到 显示-窗口 调整视窗的宽高为`480*720`，这是一个竖屏分辨率



接下来我们开始创建场景 `Player` `Mob` `HUD`，并最终将其放进`Main`场景中

# Player

为玩家场景添加Area节点，并为其添加子节点

1. `AnimatedSprite2D ` 场景用来播放动画
2. `CollisionShape2D` 用来创建碰撞箱





确保选中了`AnimatedSprite2D`节点，并且在默认布局的右侧的检查器中找到`Sprite Frames` 属性，为其新建一个`SpriteFrames`，在`SpriteFrames`中为其添加动画，动画放在了资源包中，一共要新建三个动画对应的动画都在art文件夹中（之前下载的资源包）。为动画命名并且添加动画（将art文件夹中的png拖动到动画帧的空白中）

选中`AnimatedSprite2D`节点，在其检查起中设置Scale（大小）为0.75以符合窗口大小。

选中碰撞箱节点，为其添加一个形状（尽可能符合实际动画的大小）



现在我们需要选中player主节点，在旁边的按钮为其添加脚本。我们不需要设置一些其他的东西，确定就好。

新建了脚本后，我们会发现自带了一些内容。

1. `extends Area2D` (他继承自Area的子节点)
2. `func _ready() ->void: ` （这个方法会在场景开始时被调用，此时可以检查窗口大小或者设置一些其他应当初始化的属性）
3. `func _process(delta:float) -> void:` （这个方法在每一帧都被调用，我们可以用他来检测一些内容并做出相应的逻辑以便实时更新）"delta 参数是 *帧长度* ——完成上一帧所花费的时间。 使用这个值的话，可以保证你的移动不会被帧率的变化所影响。"



> 写下第一行代码前要知道，Godot遵循
>
> 1. 类名（节点名）为驼峰命名法（`AnimatedSprite2D`）
> 2. 变量以及方法为蛇形命名法（`on_body_entered()`）
> 3. 内置方法一般有一个`_`在方法名前（`_ready()`）

为其声明一个速度变量，以便在后续调用这个变量操控角色移动

`@export var speed = 400` ，其中`@export` 的含义为将这个变量暴露在检查器中，我们可以在检查器中更改他的速度，以便我们测试。

我们还需要`var screen_size` 声明屏幕大小



接下来我们需要一切开始前初始化（`_ready()`）我们的窗口边界，这个内容之后不会变动，所以放在这里。



接下来我们要为角色添加移动功能，首先，为项目添加输入映射，在左上角项目中选择项目设置，找到输入映射标签页，在添加新动作的输入框中输入四个方向的移动

`move_right` 以此类推完成四个方向，并为四个方向添加对应的按键（在右侧的加号添加事件，此时只需要按下对应的按键，按下确定，就代表已经完成）



现在我们要实时检测输入，就要在`_process`中声明一个velocity二维数组变量，检测其输入。

```gds
	# 声明坐标：此Vector是一个向量坐标，当对应的映射被按下时，对应的值就会增减
	# 而又因为此方法在每一帧都会被调用，就会做成每一帧都在检测映射有没有按下
	# 如果某一帧没有按下，自然停止
	var velocity = Vector2.ZERO
	# 检测输入
	if	Input.is_action_pressed("move_right"):
		velocity.x +=1
	if	Input.is_action_pressed("move_left"):
		velocity.x -=1
	if	Input.is_action_pressed("move_up"):
		velocity.y -=1
	if	Input.is_action_pressed("move_down"):
		velocity.y +=1
```



接下来检测这个二维向量，如果他的长度大于0，就代表角色在执行移动，否则停止移动动画。

```gds
	# 如果向量值大于0 就代表角色在执行移动，（=0则为没有输入任何映射，也就是原地不动）
	if velocity.length() >0 :
		# normalized(),
		velocity = velocity.normalized() * speed
		$AnimatedSprite2D.play() #  $ 是 get_node() 的简写。
	# 否则停止动画
	else :
		$AnimatedSprite2D.stop()

```



> `$` 是 `get_node()` 的简写。因此在上面的代码中，`$AnimatedSprite2D.play()` 与 `get_node("AnimatedSprite2D").play()` 相同。
> 这个意思是，得到`动画`节点,调用`播放`方法

> 关于normalized(),AI提供更加详细的解释：
>
> 如果你的角色**同时按** `move_right` 和 `move_down`，那么
>
> `velocity` 就是 `(1, 1)`
>
> 它的长度是 `√(1² + 1²) = √2 ≈ 1.414`
>
> 也就是说，**斜着走的速度比直着走更快**（快了约 41%）。这并不是我们想要的——我们希望不管朝哪个方向，移动速度都是恒定的 `speed`。
>
> velocity.normalized()的作用是把这个向量缩放到长度为 1：
>
> `(1, 1)` → `(0.707, 0.707)`，长度变成 1
>
> 然后再乘以 `speed`（角色速度），这样**任何方向的速度都是 `speed`**。
>
> 直走时也一样：`(1, 0)` 归一化还是 `(1, 0)`，长度是 1，相乘后就是 `speed`，保持不变。



方向和速度都确定了后，我们就需要更新距离

```gds
position += velocity * delta
	# clamp 一个值意味着将其限制在给定范围内。两个params一个为最小值，一个为最大值
	position = position.clamp(Vector2.ZERO, screen_size)
```



同时，我们需要更新对应的动画，使其在四个方向上有些区别，方便玩家看出现在的移动方向



```gds
	if velocity.x != 0:
		$AnimatedSprite2D.animation = "walk"
		# flip_v返回bool值，为真则垂直反转，flip_h则是水平反转
		$AnimatedSprite2D.flip_v = false
		$AnimatedSprite2D.flip_h = velocity.x < 0
	elif velocity.y != 0:
		$AnimatedSprite2D.animation = "up"
		$AnimatedSprite2D.flip_v = velocity.y > 0
	
```



现在角色已经可以四处走动，并且播放正确的动画，如果没有，请检测代码是否有错误。（各类调用严格遵循大小写）



按`F6`启动游戏，我们就可以看到这一切。



我们不希望在游戏还没开始的时候，玩家就已经出现了，所以在初始化时，调用hide()方法隐藏玩家。

```gds
func _ready() -> void:
	...
	hide()
```



我们需要让player检测是否有敌人撞击到玩家，所以我们需要声明一个信号

`signal hit` 接下来，点击在场景树中点击player，并在右侧的检查器中选择信号标签页，可以看到除了一些内置的信号，我们也创建了一个hit()信号。目前我们先不管他。

找到Area2D节点中的body_entered信号，点击连接，连接到player。

我们会发现Godot为我们创建了一个方法`func _on_body_entered(body : Node2D) -> void :`

为其编写代码（当body_entered信号被触发时应该执行的代码）

```gds
func _on_body_entered(body : Node2D) -> void :
	# 隐藏角色
	hide()
	# emit 发出该信号。
	hit.emit()
	# set_deferred 在当前帧的末尾，将给定属性p1分配p2的值
	# 使用这个方法可以告诉godot以安全的更新状态，防止某一帧进入之后重复的触发hit
	$CollisionShape2D.set_deferred("disabled",true)
```



> 解释：添加的方法是一个检测方法，如果此信号被触发了，那么就执行相应的逻辑
>
> 在此处，我们需要让玩家自己检测自己有没有被击中，所以信号连接的是玩家类，也就是他本身，由他检测，由他触发。



我们需要为玩家创建一个start方法，这个方法包含了一些开始游戏时，玩家操控的角色应该做的事。

```gds
# 在游戏开始时，调用这个方法，在开始新游戏的时候重置玩家
func start(pos):
	position = pos
	show()
	$CollisionShape2D.disabled = false
```

看起来有一头雾水吗，没关系，稍后我们会用到这些。





# Mob

如法炮制的制作Mob场景，为其添加如下四个节点



1. RigidBody2D（名为 Mob） 
2. AnimatedSprite2D    
3. CollisionShape2D
4. VisibleOnScreenNotifier2D 



> [RigidBody2D](https://docs.godotengine.org/zh-cn/4.x/classes/class_rigidbody2d.html#class-rigidbody2d)，总而言之，它实现了完整的2D物理，无法被直接控制，必须对其施加力 如重力等
>
> 我们选用RigidBody2D的原因是，body_entered信号会检测这种节点是否进入了范围
>
> 为了使其无法选中，（一些意料之外的选中从而会导致bug），将其父节点锁定。



选择Mob节点，在右侧的检查器中设置他的重力为0，并且找到CollisionShape2D部分，展开collision组，取消勾选Mask 1 ，这样可以确保怪物之间不会碰撞。



如法炮制的设置AnimatedSprite2D，但这次，我们是在生成怪物时，随机生成某一种动画的怪物，所以将其帧率调整为3，并且缩小这个场景Scale为0.75,也为其添加碰撞箱。



现在添加他的脚本。

```gds
func _ready():
	var mob_types = Array($AnimatedSprite2D.sprite_frames.get_animation_names())
	$AnimatedSprite2D.animation = mob_types.pick_random()
	$AnimatedSprite2D.play()
```

这段代码的含义是

1. 声明一个怪物类型的数组，这个数组的元素为AnimatedSprite2D节点中，sprite_frames属性中获取动画名称的列表，在之前的添加动画中，我们为其添加了三种动画[fly,swim,walk] 所以，types现在有这三种类型的敌人
2. 生成的这个Mob的动画为 types中的其中一种（random函数）
3. 播放这个动画



我们需要在怪物离开屏幕的时候删除（释放）这个场景资源，所以，我们需要添加这样的代码

```gds
func _on_visible_on_screen_notifier_2d_screen_exited():
	queue_free()
```

>  queue_free() 是一个函数，基本上是在帧结束时“释放”或删除节点。



# Main

> 此处大部分截取自GodotDocs，因基础行为我们已经掌握，所以不再另行说明

在这个场景中，我们实例化之前制作的`player.tscn`场景，

为其添加子节点

现在，将下列节点添加为 `Main` 的子节点，并按如下所示对它们进行命名：

- Timer（名为 `MobTimer`）——控制怪物产生的频率
- Timer（名为 `ScoreTimer`）——每秒增加分数
- Timer（名为 `StartTimer`）——在开始之前给出延迟
- Marker2D（名为 `StartPosition`）——表示玩家的起始位置

如下设置每个 `Timer` 节点的 `Wait Time` 属性（值以秒为单位）：

- `MobTimer`：`0.5`
- `ScoreTimer`：`1`
- `StartTimer`：`2`





此外，将 `StartTimer` 的 `One Shot` 属性设置为“启用”，并将 `StartPosition` 节点的 `Position` 设置为 `(240, 450)`。





主节点将生成新的怪物，我们希望它们出现在屏幕边缘的随机位置。点击场景面板中的 `Main` 节点，然后添加一个 [Path2D](https://docs.godotengine.org/zh-cn/4.x/classes/class_path2d.html#class-path2d) 名为 `MobPath` 的子节点。当选中 `Path2D` 节点后，你会在编辑器顶部看到一些新按钮：



选中中间的按钮（"添加点"），然后通过ctrl+点击屏幕四角添加路径点。若要使点自动吸附到网格上，请确保同时勾选"启用网格吸附"和"启用智能吸附"选项。这两个选项位于"锁定"按钮的左侧，分别显示为磁铁图标和带有交叉线的点阵图标。



以*顺时针*的顺序绘制路径，否则小怪会*向外*而非*向内*生成！



点击“闭合曲线”按钮，你的曲线就完成了。

现在已经定义了路径，添加一个 [PathFollow2D](https://docs.godotengine.org/zh-cn/4.x/classes/class_pathfollow2d.html#class-pathfollow2d) 节点作为 `MobPath` 的子节点，并将其命名为 `MobSpawnLocation`。 该节点在移动时，将自动旋转并沿着该路径，因此我们可以使用它沿路径来选择随机位置和方向。



将脚本添加到 `Main`。在脚本的顶部，我们使用 `@export var mob_scene: PackedScene` 来允许我们选择要实例化的 Mob 场景。



```gds
func game_over():
	$ScoreTimer.stop()
	$MobTimer.stop()

func new_game():
	score = 0
	$Player.start($StartPosition.position)
	$StartTimer.start()
```



找到player的场景示例，找到他的信号列表，选择之前创建的hit信号，点击连接，连接到game_over的函数，此举含义为当被击中时，游戏结束，并且不再计时



> 此处截取自GodotDocs

现在将每个 Timer 节点（`StartTimer`、`ScoreTimer` 和 `MobTimer`）的 `timeout()` 信号连接到主脚本。对于这三个计时器，依次执行以下操作：在场景停靠栏选中计时器 → 打开节点停靠栏的信号标签页 → 双击列表中的 `timeout()` 信号 → 在弹出的信号连接对话框中点击 **Connect** （保持默认设置即可）。

完成这三个计时器的设置后，你可以在它们各自的“信号”选项卡中看到每个计时器的 `timeout()` 信号都已成功连接，并以绿色高亮显示。

- （对于 MobTimer）：`_on_mob_timer_timeout()`
- （对于 ScoreTimer）：`_on_score_timer_timeout()`
- （对于 StartTimer）：`_on_start_timer_timeout()`

现在我们通过添加下面的代码来定义这些计时器的操作方式。注意到`StartTimer`将启动其他两个计时器，然后`ScoreTimer` 将使得分加 1。



```gds
func _on_score_timer_timeout():
	score += 1

func _on_start_timer_timeout():
	$MobTimer.start()
	$ScoreTimer.start()
```



在 `_on_mob_timer_timeout()` 中， 我们先创建小怪实例，然后沿着 `Path2D` 路径随机选取起始位置，最后让小怪移动。`PathFollow2D` 节点将沿路径移动，并会自动旋转，所以我们将使用它来选择怪物的方位和朝向。生成小怪后，我们会在 `150.0` 和 `250.0` 之间选取随机值，表示每只小怪的移动速度（如果它们都以相同的速度移动，那么就太无聊了）。



注意，必须使用 `add_child()` 将新实例添加到场景中。



```gds
func _on_mob_timer_timeout():
	# Create a new instance of the Mob scene.
	var mob = mob_scene.instantiate()

	# Choose a random location on Path2D.
	var mob_spawn_location = $MobPath/MobSpawnLocation
	mob_spawn_location.progress_ratio = randf()

	# Set the mob's position to the random location.
	mob.position = mob_spawn_location.position

	# Set the mob's direction perpendicular to the path direction.
	var direction = mob_spawn_location.rotation + PI / 2

	# Add some randomness to the direction.
	direction += randf_range(-PI / 4, PI / 4)
	mob.rotation = direction

	# Choose the velocity for the mob.
	var velocity = Vector2(randf_range(150.0, 250.0), 0.0)
	mob.linear_velocity = velocity.rotated(direction)

	# Spawn the mob by adding it to the Main scene.
	add_child(mob)
```



> 为什么要用 `PI`？在需要传入角度的函数中，Godot 使用的是*弧度*而不是度数。圆周率（Pi）表示转半圈的弧度，约为 `3.1415`（还提供了等于 `2 * PI` 的 `TAU`）。如果你更喜欢使用度数，则需使用 `deg_to_rad()` 和 `rad_to_deg()` 函数在这两种单位之间进行转换。



让我们测试这个场景，确保一切正常。请将对 `new_game` 的调用添加至 `_ready()`：

```
func _ready():
	new_game()
```

测试完毕后我们需要删除这个new_game()并替换为pass





后续，因为基础操作已经完成了，后续只需要跟着做就可以完成项目，不再另行说明。



[Godot：heads_up_display](https://docs.godotengine.org/zh-cn/4.x/getting_started/first_2d_game/06.heads_up_display.html#)









