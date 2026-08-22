---
date: 2026-6-6
tag: Godot
---



> 此文章全程学习自[从零开始的Godot游戏开发](https://www.bilibili.com/video/BV1UQRwBoEiy) by [Voidmatrix](https://space.bilibili.com/25864506) 
>
> 只做学习用途部署于网站中，如有侵犯联系本人即可删除

# 控制玩家移动





```gdscript
extends CharacterBody2D

# 设置玩家移动速度，单位是像素/秒
@export var move_speed :float = 120.0

func _physics_process(delta: float) -> void:
	# 读取四个方向的输入,并得到标准化后的八项输入向量
	var move_input : =Input.get_vector("move_left","move_right","move_up","move_down")
	
	# body2D 通过 velocity 配合 move_and_slide() 完成移动
	
	velocity = move_input * move_speed
	move_and_slide()
	

```



要点：



`@export` 导出属性，使定义的变量 暴露在编辑器中方便编辑

如 health speed ...

`_physics_process()`  在这里编写和玩家移动，碰撞，速度更新相关的内容，就能够确保在游戏运行的过程中实时响应，背后有一个固定的刷新计时器，默认60次/s 

> 逻辑刻

而 `_process_` 跟着画面刷新走，不走逻辑帧，走渲染帧（~~我自己写的 老师没说~~）



`var move_input : =Input.get_vector("move_left","move_right","move_up","move_down")` 通过Input.get_vector()方法传入配置的各个动作的名字，按照左右上下的顺序写进去 这个函数就会自动计算标准化的移动向量，很方便，简单理解为WASD操作，计算应该运动的朝向 

通过与 `move_speed` 相乘，得到`velocity` 速度值

`velocity` 并不是通过var定义的局部变量，而是`CharacterBody2D`内部的成员变量

`move_and_slide() `在游戏世界中真正的使用当前速度，改变自身的位置进行移动





> A: GDScript，轻而易举啊！
>
> A: 坏了。
>
> <\Server>A 被Bug炸死了



添加

`const NORMAL_ANIMATION_PREFIX := &"normal"`

`:=` 告诉godot在赋值时自动判断静态类型，不用再写动态类型

`&` 字面量，内部标签名，这是一个固定的名字，



```gds
extends CharacterBody2D

const NORMAL_ANIMATION_PREFIX := &"normal"

# 角色动画节点,负责播放四方向移动动画
@onready var body_sprite:AnimatedSprite2D =$BodySprite

# 当前朝向后缀,对应动画名中的 up down left right
var facing_suffix:StringName= &"right"

# 设置玩家移动速度，单位是像素/秒
@export var move_speed :float = 120.0

# 节点就绪时会被调用
func _ready() -> void:
	_update_animation()

func _physics_process(delta: float) -> void:
	# 读取四个方向的输入,并得到标准化后的八项输入向量
	var move_input : =Input.get_vector("move_left","move_right","move_up","move_down")
	
	# body2D 通过 velocity 配合 move_and_slide() 完成移动
	
	velocity = move_input * move_speed
	move_and_slide()
	
	if move_input != Vector2.ZERO:
		facing_suffix=_vector_to_facing_suffix(move_input)
		
	_update_animation()
		
	#更新动画
func _update_animation():
	
	
# 根据当前朝向拼出动画名,并在动画实际变化时再切换播放
	var animation_name := StringName("%s_%s"%[NORMAL_ANIMATION_PREFIX,facing_suffix])
	
	if not body_sprite.sprite_frames.has_animation(animation_name):
		push_warning("Missing player animation :%s" % animation_name)
		return 
		
	if body_sprite.animation != animation_name:
		body_sprite.play(animation_name)


# 将任一二维向量映射为四方向动画
# 对角输出会优先取绝对值更大的轴,避免在四方向动画里出现歧义
func _vector_to_facing_suffix(direction:Vector2) ->StringName:
	if abs(direction.x) >= abs(direction.y):
		if direction.x>0.0:
			return &"right" 
		else:
			return &"left" 
		
	return &"down" if direction.y>0.0 else &"up"
	

```



> 不想写说明了，看吧





# 常见Node2D子节点区别



| 功能            | 物理模拟 | 子节点          | 常见应用             |
| --------------- | -------- | --------------- | -------------------- |
| 需要 范围检测   | 否       | Area2D          | 简单子弹             |
| 需要 脚本控制   | 是       | CharacterBody2D | 玩家                 |
| 不需要 脚本控制 | 是       | RigidBody2D     | 击落后的散落物       |
| 不需要移动      | 是       | StaticBody2D    | 地图边界，物理碰撞箱 |





# Bullet



```gds
extends Area2D
class_name Bullet

# 声明变量,方便后续手动进行场景障碍物的碰撞判断
# 与层数的碰撞数 2^n-1
const WORLD_COLLISION_MASK := 1

# 子弹飞行速度,单位为像素/秒
@export var speed: float = 320
# 子弹最大存活时间
@export var max_lifetime:float = 2.0

# 子弹当前的飞行方向
var direction: Vector2 = Vector2.RIGHT
# 剩余存活时间
var remaining_lifetime:float = 0.0

func _ready() -> void:
	remaining_lifetime = max_lifetime
	area_entered.connect(_on_area_entered)
	
	
# 由外部在生成子弹后调用，注入初始方向
func setup(initial_direction:Vector2) -> void :
	if initial_direction !=Vector2.ZERO :
		direction= initial_direction.normalized()
	
	rotation = direction.angle()
	
	
	
# 每帧先检测飞行路径是否会撞到世界，再更新位置并处理超时回收
func _physics_process(delta: float) -> void:
	var current_position := global_position
	var next_position := current_position+direction*speed*delta
	
	if _will_hit_world(current_position,next_position):
		
		#此方法不是瞬时消除，而是在这一帧(delta) 结束后在合适的时候进行消除
		queue_free()
		return
		
	global_position = next_position
		#没有命中任何对象时，也要在超时后自动清理
	remaining_lifetime -= delta
	if remaining_lifetime<=0.0:
		queue_free()

# 使用射线查询检测当前这一帧的飞行路径，避免子弹穿过零厚度边界或薄墙体。
func _will_hit_world(from_position : Vector2,to_position:Vector2)->bool:
	var space_state :=get_world_2d().direct_space_state
	if space_state == null:
		return false
		
	var query := PhysicsRayQueryParameters2D.create(
		from_position,
		to_position,
		WORLD_COLLISION_MASK
	)
	query.collide_with_bodies= true
	query.collide_with_areas = false
	
	var hit_result : Dictionary = space_state.intersect_ray(query)
	return not hit_result.is_empty()


func _on_area_entered(area:Area2D) -> void:
	if area is Bullet:
		return
	
	queue_free()


```



