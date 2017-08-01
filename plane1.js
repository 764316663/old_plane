// JavaScript Document

var gamespace = document.getElementById("gamespace"); //游子戏空间
var enemies = []; //new Array(); //敌机数组
var en = 0; //敌机的数量
var mybullets = []; //子弹数组
var bn = 0; //子弹的数量
var scores = 0; //分数
var gamelabel = document.getElementById("game-label");
var boomlabel = document.getElementById("boom-label");
var gamescores = document.getElementById("game-scores");
var gameover = 0; //游戏结束变量
var boom = 10; //炸弹
var mbullet = 1; //子弹类型变量
var bgm = document.getElementById("bgm1");
var bgm_play = 1;
//定义飞机的对象模板类
function plane(hp, X, Y, sizeX, sizeY, dietime, speedX, speedY, boomimage, imagesrc, planescore) {
	this.planeHP = hp; //飞机血气
	this.planeX = X; //飞机坐标
	this.planeY = Y; //飞机坐标
	this.planeSizeX = sizeX; //飞机尺寸
	this.planeSizeY = sizeY; //飞机尺寸
	this.planeDietime = dietime; //飞机被打掉后，在屏幕上的暴炸时间
	this.planeSpeedX = speedX; //飞机速度
	this.planeSpeedY = speedY; //飞机速度
	this.planeImgSrc = imagesrc; //飞机图片
	this.planeImgBoom = boomimage; //飞机炸的图片
	this.planeScore = planescore; //飞机的分数
	this.islive = 1; //飞机你还活着吗？

	this.planeImg = null; //表示html中的一个<img scr="1.jpg" >

	this.createplane = function() //在的对象模板类内部建 一个属它自已的函数
		{ //在html的游戏空间中的一个<img scr="1.jpg">
			this.planeImg = document.createElement("img"); ////在html的游戏空间中的一个<img src="1.jpg">
			this.planeImg.style.position = "absolute"; //设置坐标的模式（绝对参考）
			this.planeImg.style.left = this.planeX + "px";
			this.planeImg.style.top = this.planeY + "px";
			this.planeImg.style.width = this.planeSizeX + "px";
			this.planeImg.style.height = this.planeSizeY + "px";
			this.planeImg.src = this.planeImgSrc; //生成的<img>所用的图片
			gamespace.appendChild(this.planeImg);
		}
		//执行函数
	this.createplane();

	// 定义一个飞的动作 （飞一步）
	this.fly_OneStep = function() {
		//this.planeImg.style.left = this.planeImg.offsetLeft+ this.planeSpeedX+"px"
		//this.planeImg.style.top = this.planeImg.offsetTop+ 5+"px"
		if (this.islive == 0)
			return;

		this.planeX += this.planeSpeedX;
		this.planeY += this.planeSpeedY;

		this.planeImg.style.left = this.planeX + "px";
		this.planeImg.style.top = this.planeY + "px";

	}
}

//创建敌机
//plane(hp,X,Y,sizeX,sizeY,score,dietime,speedX,speedY,boomimage,imagesrc,planescore)
function make_enemy1() //小飞机
{
	var mx = Math.random() * 1040;
	//随机生成敌机（改成随机）
	var e = new plane(1, mx, 0, 40, 60, 2000, 0, 2, "images/b1.gif", "images/敌机1.png", 1000);
	enemies.push(e); //把敌机对象压入数组中，进行管理
	en++;
}

function make_enemy2() //中飞机
{
	var mx = Math.random() * 1000;
	//随机生成敌机（改成随机）
	var e = new plane(6, mx, 0, 80, 80, 2000, 0, 2, "images/b2.gif", "images/敌机2.png", 2000);
	enemies.push(e); //把敌机对象压入数组中，进行管理
	en++;
}

function make_enemy3() //大飞机
{
	var mx = Math.random() * 980;
	//随机生成敌机（改成随机）
	var e = new plane(12, mx, 0, 100, 136, 2000, 0, 2, "images/b3.gif", "images/敌机3.png", 5000);
	enemies.push(e); //把敌机对象压入数组中，进行管理
	en++;
}

function fly_enemy() {
	//每一飞机都走一步
	for (var i = 0; i < en; i++)
		enemies[i].fly_OneStep();

	//判断飞机是否已死，计时（把planeDietime）
	for (var i = 0; i < en; i++) {
		if (enemies[i].islive == 0) {
			enemies[i].planeDietime -= 50;
			if (enemies[i].planeDietime <= 0) //该清这已死了一段时间的飞机了
			{
				gamespace.removeChild(enemies[i].planeImg);
				enemies.splice(i, 1); //从数组enemies中去掉第i个元素	
				en--;
			}
		}
	}

	var x, y;
	//判断是否出界
	for (var i = 0; i < en; i++) {
		x = enemies[i].planeX + enemies[i].planeSizeX / 2;
		y = enemies[i].planeY + enemies[i].planeSizeY / 2;
		if (x < 0 || x > 1080 || y < 0 || y > 720) //出界了
		{
			gamespace.removeChild(enemies[i].planeImg);
			enemies.splice(i, 1); //从数组enemies中去掉第i个元素	
			en--;
		} //

	}
}
//我的飞机
//(hp,X,Y,sizeX,sizeY,score,dietime,speedX,speedY,boomimage,imagesrc)
var myplane = new plane(100, 540, 640, 56, 80, 2000, 1, 2, "b2.gif", "images/plane1.png", 0);

//定义子弹数组
function bullet(X, Y, sizeX, sizeY, speedX, speedY, imagesrc) {
	this.bX = X; //坐标
	this.bY = Y; //坐标
	this.bsizeX = sizeX; //子弹图像宽
	this.bsizeY = sizeY; //子弹图像高
	this.bspeedX = speedX; //子弹横向速度
	this.bspeedY = speedY; //子弹纵向速度
	this.bimagesrc = imagesrc;

	this.bImg = null; //表示html中的一个<img scr="1.jpg" >
	this.createbullet = function() //在的对象模板类内部建 一个属它自已的函数
		{ //在html的游戏空间中的一个<img scr="1.jpg">
			this.bImg = document.createElement("img"); ////在html的游戏空间中的一个<img src="1.jpg">
			this.bImg.style.position = "absolute"; //设置坐标的模式（绝对参考）
			this.bImg.style.left = this.bX + "px";
			this.bImg.style.top = this.bY + "px";
			this.bImg.style.width = this.bsizeX + "px";
			this.bImg.style.height = this.bsizeY + "px";
			this.bImg.src = this.bimagesrc; //生成的<img>所用的图片
			gamespace.appendChild(this.bImg);
		}

	//执行函数
	this.createbullet();

	// 定义一个飞的动作 （飞一步）
	this.fly_OneStep = function() {
		this.bX += this.bspeedX;
		this.bY += this.bspeedY;

		this.bImg.style.left = this.bX + "px";
		this.bImg.style.top = this.bY + "px";
	}
}

function make_bullet() //生成一颗子弹，初始位置为x0,y0
{
	//我方飞机的置	bullet(X,Y,sizeX,sizeY,speedX,speedY,imagesrc)
	var x0 = myplane.planeX + myplane.planeSizeX / 2;
	var y0 = myplane.planeY + myplane.planeSizeY / 2;

	var b = new bullet(x0 - 5, y0 - 30, 5, 20, 0, -5, "images/bullet1.png");
	mybullets.push(b);
	bn++;
}

function make_missile() {
	make_bullet1();
	make_bullet2();
}

function make_bullet1() //生成一颗子弹，初始位置为x0,y0
{
	//我方飞机的置	bullet(X,Y,sizeX,sizeY,speedX,speedY,imagesrc)
	var x0 = myplane.planeX + myplane.planeSizeX / 2;
	var y0 = myplane.planeY + myplane.planeSizeY / 2;

	var b = new bullet(x0 - 25, y0 - 30, 6, 33, 0, -8, "images/导弹1.png");
	mybullets.push(b);
	bn++;
}

function make_bullet2() //生成一颗子弹，初始位置为x0,y0
{
	//我方飞机的置	bullet(X,Y,sizeX,sizeY,speedX,speedY,imagesrc)
	var x0 = myplane.planeX + myplane.planeSizeX / 2;
	var y0 = myplane.planeY + myplane.planeSizeY / 2;

	var b = new bullet(x0 + 15, y0 - 30, 6, 33, 0, -8, "images/导弹1.png");
	mybullets.push(b);
	bn++;
}

function make_morebullet() {
	make_bullet3();
	make_bullet4();
	make_bullet5();
	make_bullet6();
}

function make_bullet3() //生成一颗子弹，初始位置为x0,y0
{
	//我方飞机的置	bullet(X,Y,sizeX,sizeY,speedX,speedY,imagesrc)
	var x0 = myplane.planeX + myplane.planeSizeX / 2;
	var y0 = myplane.planeY + myplane.planeSizeY / 2;

	var b = new bullet(x0 - 35, y0 - 30, 5, 20, 0, -5, "images/bullet1.png");
	mybullets.push(b);
	bn++;
}

function make_bullet4() //生成一颗子弹，初始位置为x0,y0
{
	//我方飞机的置	bullet(X,Y,sizeX,sizeY,speedX,speedY,imagesrc)
	var x0 = myplane.planeX + myplane.planeSizeX / 2;
	var y0 = myplane.planeY + myplane.planeSizeY / 2;

	var b = new bullet(x0 - 15, y0 - 30, 5, 20, 0, -5, "images/bullet1.png");
	mybullets.push(b);
	bn++;
}

function make_bullet5() //生成一颗子弹，初始位置为x0,y0
{
	//我方飞机的置	bullet(X,Y,sizeX,sizeY,speedX,speedY,imagesrc)
	var x0 = myplane.planeX + myplane.planeSizeX / 2;
	var y0 = myplane.planeY + myplane.planeSizeY / 2;

	var b = new bullet(x0 + 5, y0 - 30, 5, 20, 0, -5, "images/bullet1.png");
	mybullets.push(b);
	bn++;
}

function make_bullet6() //生成一颗子弹，初始位置为x0,y0
{
	//我方飞机的置	bullet(X,Y,sizeX,sizeY,speedX,speedY,imagesrc)
	var x0 = myplane.planeX + myplane.planeSizeX / 2;
	var y0 = myplane.planeY + myplane.planeSizeY / 2;

	var b = new bullet(x0 + 25, y0 - 30, 5, 20, 0, -5, "images/bullet1.png");
	mybullets.push(b);
	bn++;
}

function fly_bullet() {
	//每一子弹都走一步
	for (var i = 0; i < bn; i++)
		mybullets[i].fly_OneStep();

	var x, y;
	//判断是否出界
	for (var i = 0; i < bn; i++) {
		x = mybullets[i].bX + mybullets[i].bsizeX / 2;
		y = mybullets[i].bY + mybullets[i].bsizeY / 2;
		if (x < 0 || x > 1080 || y < 0 || y > 720) //出界了
		{
			gamespace.removeChild(mybullets[i].bImg);
			mybullets.splice(i, 1); //从数组enemies中去掉第i个元素	
			bn--;
		}
	}

	var bx, by;
	var px, py;
	var cx, cy;
	//逐个判断子弹是否碰到飞机
	for (var i = 0; i < bn; i++) { //	bullet(X,Y,sizeX,sizeY,speedX,speedY,imagesrc)
		bx = mybullets[i].bX + mybullets[i].bsizeX / 2;
		by = mybullets[i].bY + mybullets[i].bsizeY / 2;
		for (var j = 0; j < en; j++) {
			px = enemies[j].planeX + enemies[j].planeSizeX / 2;
			py = enemies[j].planeY + enemies[j].planeSizeY / 2;
			cx = myplane.planeX + myplane.planeSizeX / 2;
			cy = myplane.planeY + myplane.planeSizeY / 2;

			if (enemies[j].islive == 1) //如果飞机还活着，已死飞机爆炸图片不算活着
			{
				if (cx > px - enemies[j].planeSizeX / 2 && cx < px + enemies[j].planeSizeX / 2) { //enemys[j].imagenode.offsetLeft
					//enemies[j].planeX + enemies[j].planeSizeX/2
					if (cy > py - enemies[j].planeSizeY && cy < py + enemies[j].planeSizeY / 2) { //enemys[j].imagenode.offsetLeft+enemys[j].plansizeX>=selfplan.imagenode.offsetLeft&&enemys[j].imagenode.offsetLeft<=selfplan.imagenode.offsetLeft+selfplan.plansizeX
						enemies[j].islive = 0;
						stopplay();
						gamescores.innerHTML = scores;
						game_over();
					}
				}
				if (bx > px - enemies[j].planeSizeX / 2 && bx < px + enemies[j].planeSizeX / 2 && by > py - enemies[j].planeSizeY / 2 && by < py + enemies[j].planeSizeY / 2) {
					enemies[j].planeHP--;
					if (enemies[j].planeHP == 0) {

						//碰到了，把敌机的图片换成爆炸图
						enemies[j].planeImg.src = enemies[j].planeImgBoom;
						enemies[j].islive = 0; //飞机死了
						scores = scores + enemies[j].planeScore;
						gamelabel.innerHTML = scores;
						if (gs == 4) {
							if (scores <= 1005000) {
								if (scores >= 0 && scores < 20000) {
									if (scores > 4000)
										break;
									check_up_scores();
								} else if (scores >= 20000 && scores < 60000) {
									if (scores > 24000)
										break;
									check_up_scores();
								} else if (scores >= 60000 && scores < 120000) {
									if (scores > 64000)
										break;
									check_up_scores();
								} else if (scores >= 120000 && scores < 200000) {
									if (scores > 124000)
										break;
									check_up_scores();
								} else if (scores >= 200000 && scores < 300000) {
									if (scores > 204000)
										break;
									check_up_scores();
								} else if (scores >= 300000 && scores < 600000) {
									if (scores > 304000)
										break;
									check_up_scores();
								} else if (scores >= 600000 && scores < 1000000) {
									if (scores > 604000)
										break;
									check_up_scores();
								} else if (scores >= 1000000) {
									if (scores > 1004000)
										break;
									check_up_scores();
								}
							} else {
								break;
							}
						}
					}

					//此子弹报废
					gamespace.removeChild(mybullets[i].bImg);
					mybullets.splice(i, 1); //从数组enemies中去掉第i个元素	
					bn--;
					break;
				}
			}
		}
	}
}

function enemies_boom() {
	for (var eboom = 0; eboom < enemies.length; eboom++) {
		if (boom > 0) {
			enemies[eboom].planeHP = 0;
			scores = scores + enemies[eboom].planeScore;
			gamelabel.innerHTML = scores;
			enemies[eboom].planeImg.src = enemies[eboom].planeImgBoom;
			enemies[eboom].islive = 0;
			if (gamend == 4) {
				check_up_scores();
			}
		}
	}
	boom--;
	if (boom >= 0)
		boomlabel.innerHTML = boom;
}

var t1, t2, t3, t4, t5, t6;
var gamend = 0;

function startplay1() {
	gamend = 1;
	t1 = setInterval("make_enemy1()", 500);
	t2 = setInterval("fly_enemy()", 20);
	t3 = setInterval("fly_bullet()", 20);
	t5 = setInterval("make_enemy2()", 1000);
	t6 = setInterval("make_enemy3()", 2000);
	if (mbullet == 1) {
		t4 = setInterval("make_bullet()", 20);

	} else if (mbullet == 2) {
		t4 = setInterval("make_missile()", 50);
	} else if (mbullet == 3) {
		t4 = setInterval("make_morebullet()", 100);
	}

	//把事件加到DIV
	if (document.addEventListener) {
		//添加onmousemove事件到gamespace
		gamespace.addEventListener("mousemove", do_move, true);
	} else if (document.attachEvent) {
		attachEvent("onmousemove", do_move);
	}
}

function startplay2() {
	gamend = 2;
	t1 = setInterval("make_enemy1()", 500);
	t2 = setInterval("fly_enemy()", 15);
	t3 = setInterval("fly_bullet()", 20);
	t5 = setInterval("make_enemy2()", 1000);
	t6 = setInterval("make_enemy3()", 2000);
	if (mbullet == 1) {
		t4 = setInterval("make_bullet()", 100);

	} else if (mbullet == 2) {
		t4 = setInterval("make_missile()", 250);
	} else if (mbullet == 3) {
		t4 = setInterval("make_morebullet()", 500);
	}

	if (document.addEventListener) {
		//添加onmousemove事件到gamespace
		gamespace.addEventListener("mousemove", do_move, true);
	} else if (document.attachEvent) {
		attachEvent("onmousemove", do_move);
	}
}

function startplay3() {
	gamend = 3;
	t1 = setInterval("make_enemy1()", 400);
	t2 = setInterval("fly_enemy()", 10);
	t3 = setInterval("fly_bullet()", 20);
	t5 = setInterval("make_enemy2()", 800);
	t6 = setInterval("make_enemy3()", 1500);
	if (mbullet == 1) {
		t4 = setInterval("make_bullet()", 120);

	} else if (mbullet == 2) {
		t4 = setInterval("make_missile()", 300);
	} else if (mbullet == 3) {
		t4 = setInterval("make_morebullet()", 500);
	}

	//把事件加到DIV
	if (document.addEventListener) {
		//添加onmousemove事件到gamespace
		gamespace.addEventListener("mousemove", do_move, true);
	} else if (document.attachEvent) {
		attachEvent("onmousemove", do_move);
	}
}

function startplay4() {
	gamend = 4;
	if (scores >= 0 && scores < 20000) {
		t1 = setInterval("make_enemy1()", 500);
		t2 = setInterval("fly_enemy()", 20);
		t3 = setInterval("fly_bullet()", 20);
		t5 = setInterval("make_enemy2()", 1000);
		t6 = setInterval("make_enemy3()", 2000);
		if (mbullet == 1) {
			t4 = setInterval("make_bullet()", 20);
		} else if (mbullet == 2) {
			t4 = setInterval("make_missile()", 50);
		} else if (mbullet == 3) {
			t4 = setInterval("make_morebullet()", 100);
		}
	} else if (scores >= 20000 && scores < 60000) {
		t1 = setInterval("make_enemy1()", 500);
		t2 = setInterval("fly_enemy()", 20);
		t3 = setInterval("fly_bullet()", 20);
		t5 = setInterval("make_enemy2()", 1000);
		t6 = setInterval("make_enemy3()", 2000);
		if (mbullet == 1) {
			t4 = setInterval("make_bullet()", 100);
		} else if (mbullet == 2) {
			t4 = setInterval("make_missile()", 250);
		} else if (mbullet == 3) {
			t4 = setInterval("make_morebullet()", 500);
		}
	} else if (scores >= 60000 && scores < 120000) {
		t1 = setInterval("make_enemy1()", 500);
		t2 = setInterval("fly_enemy()", 10);
		t3 = setInterval("fly_bullet()", 20);
		t5 = setInterval("make_enemy2()", 1000);
		t6 = setInterval("make_enemy3()", 2000);
		if (mbullet == 1) {
			t4 = setInterval("make_bullet()", 100);
		} else if (mbullet == 2) {
			t4 = setInterval("make_missile()", 250);
		} else if (mbullet == 3) {
			t4 = setInterval("make_morebullet()", 500);
		}
	} else if (scores >= 120000 && scores < 200000) {
		t1 = setInterval("make_enemy1()", 200);
		t2 = setInterval("fly_enemy()", 10);
		t3 = setInterval("fly_bullet()", 20);
		t5 = setInterval("make_enemy2()", 800);
		t6 = setInterval("make_enemy3()", 1500);
		if (mbullet == 1) {
			t4 = setInterval("make_bullet()", 100);
		} else if (mbullet == 2) {
			t4 = setInterval("make_missile()", 250);
		} else if (mbullet == 3) {
			t4 = setInterval("make_morebullet()", 500);
		}
	} else if (scores >= 200000 && scores < 300000) {
		t1 = setInterval("make_enemy1()", 200);
		t2 = setInterval("fly_enemy()", 10);
		t3 = setInterval("fly_bullet()", 20);
		t5 = setInterval("make_enemy2()", 500);
		t6 = setInterval("make_enemy3()", 1000);
		if (mbullet == 1) {
			t4 = setInterval("make_bullet()", 120);
		} else if (mbullet == 2) {
			t4 = setInterval("make_missile()", 300);
		} else if (mbullet == 3) {
			t4 = setInterval("make_morebullet()", 600);
		}
	} else if (scores >= 300000 && scores < 600000) {
		t1 = setInterval("make_enemy1()", 150);
		t2 = setInterval("fly_enemy()", 8);
		t3 = setInterval("fly_bullet()", 20);
		t5 = setInterval("make_enemy2()", 400);
		t6 = setInterval("make_enemy3()", 800);
		if (mbullet == 1) {
			t4 = setInterval("make_bullet()", 150);
		} else if (mbullet == 2) {
			t4 = setInterval("make_missile()", 380);
		} else if (mbullet == 3) {
			t4 = setInterval("make_morebullet()", 800);
		}
	} else if (scores >= 600000 && scores < 1000000) {
		t1 = setInterval("make_enemy1()", 100);
		t2 = setInterval("fly_enemy()", 8);
		t3 = setInterval("fly_bullet()", 20);
		t5 = setInterval("make_enemy2()", 400);
		t6 = setInterval("make_enemy3()", 800);
		if (mbullet == 1) {
			t4 = setInterval("make_bullet()", 180);
		} else if (mbullet == 2) {
			t4 = setInterval("make_missile()", 450);
		} else if (mbullet == 3) {
			t4 = setInterval("make_morebullet()", 900);
		}
	} else if (scores >= 1000000) {
		t1 = setInterval("make_enemy1()", 80);
		t2 = setInterval("fly_enemy()", 5);
		t3 = setInterval("fly_bullet()", 20);
		t5 = setInterval("make_enemy2()", 300);
		t6 = setInterval("make_enemy3()", 500);
		if (mbullet == 1) {
			t4 = setInterval("make_bullet()", 200);
		} else if (mbullet == 2) {
			t4 = setInterval("make_missile()", 500);
		} else if (mbullet == 3) {
			t4 = setInterval("make_morebullet()", 1000);
		}
	}

	if (document.addEventListener) {
		//添加onmousemove事件到gamespace
		gamespace.addEventListener("mousemove", do_move, true);
	} else if (document.attachEvent) {
		attachEvent("onmousemove", do_move);
	}

}

function stopplay() {
	clearInterval(t1);
	clearInterval(t2);
	clearInterval(t3);
	clearInterval(t4);
	clearInterval(t5);
	clearInterval(t6);
}

function check_up_scores() {
	stopplay();
	startplay4();
}

function switch_bullet() {
	if (mbullet == 1) {
		mbullet = 2;
		stopplay();
		if (gamend == 1) {
			startplay1();
		} else if (gamend == 2) {
			startplay2();
		} else if (gamend == 3) {
			startplay3();
		} else if (gamend == 4) {
			startplay4();
		}
	} else if (mbullet == 2) {
		mbullet = 3;
		stopplay();
		if (gamend == 1) {
			startplay1();
		} else if (gamend == 2) {
			startplay2();
		} else if (gamend == 3) {
			startplay3();
		} else if (gamend == 4) {
			startplay4();
		}
	} else if (mbullet == 3) {
		mbullet = 1;
		stopplay();
		if (gamend == 1) {
			startplay1();
		} else if (gamend == 2) {
			startplay2();
		} else if (gamend == 3) {
			startplay3();
		} else if (gamend == 4) {
			startplay4();
		}
	}
}

var gplay = 0;

function pasue_game() {
	stopplay();
	var a = document.getElementById("pasue");
	a.style.display = "block";
}

function continue_game() {
	var a = document.getElementById("pasue");
	a.style.display = "none";
	if (gamend == 1) {
		startplay1();
	} else if (gamend == 2) {
		startplay2();
	} else if (gamend == 3) {
		startplay3();
	} else if (gamend == 4) {
		startplay4();
	}

}

function do_move() {
	//mouse动时，执行此函数，并获得mouse位置
	var oevent = window.event || arguments[0];

	myplane.planeX = oevent.clientX - 25;
	myplane.planeY = oevent.clientY - 60;
	if (gplay == 1) {
		return;
	}
	if (oevent.clientX < 0 || oevent.clientX > 1080 || oevent.clientY < 0 || oevent.clientY > 720) {
		return;
	}

	myplane.planeImg.style.left = oevent.clientX - myplane.planeSizeX / 2 + "px";
	myplane.planeImg.style.top = oevent.clientY - myplane.planeSizeY / 2 + "px";

}

document.onkeydown = function(event) //键盘事件
	{
		var jp = event || window.event;
		if (jp && jp.keyCode == 32 && srart_to_play == 2 && gplay == 0) {
			pasue_game();
			gplay = 1;
		} else if (jp && jp.keyCode == 32 && srart_to_play == 2 && gplay == 1) {
			if (gameover == 1) {
				all.stop;
			}
			continue_game();
			gplay = 0;
		} else if (jp && jp.keyCode == 70 && gamend == 4 && gameover == 0) {
			alert("成长难度：\n20000分\n发射子弹变慢\n60000分\n全体敌机速度加快\n120000分\n三种敌机出现频率增加\n200000分\n中飞机，大飞机出现频率增加，发射子弹变慢\n300000分\n三种敌机出现频率增加，全体敌机速度加快，发射子弹变慢\n600000分\n小飞机出现频率增加，发射子弹变慢\n1000000分\n三种敌机出现频率增加，全体敌机速度加快，发射子弹变慢");
		} else if (jp && jp.keyCode == 66 && srart_to_play == 2 && gplay == 0) {
			enemies_boom();
		} else if (jp && jp.keyCode == 86 && srart_to_play == 2 && gplay == 0) {
			switch_bullet();
		} else if (jp && jp.keyCode == 68 && srart_to_play == 2 && gplay == 0) {
			if (bgm_play == 1) {
				bgm.pause();
				bgm_play = 2;
			} else if (bgm_play == 2) {
				bgm.play();
				bgm_play = 1;
			}
		}
	}

var srart_to_play = 1

function start_game() //开始游戏按钮
{
	bgm.play();
	var a = document.getElementById("start-bg-image");
	a.style.display = "none";
	var b = document.getElementById("gamespace");
	b.style.display = "block";
	var c = document.getElementById("text");
	c.style.display = "block";
	srart_to_play = 2;
}

var gs = 0;
var sg = 0;

function start_game1() {
	start_game();
	startplay1();
	gs = 1;
}

function start_game2() {
	start_game();
	startplay2();
	gs = 2;
}

function start_game3() {
	start_game();
	startplay3();
	gs = 3;
}

function start_game4() {
	alert("点击键盘方向左键查看\n成长难度：\n20000分\n发射子弹变慢\n60000分\n全体敌机速度加快\n120000分\n三种敌机出现频率增加\n200000分\n中飞机，大飞机出现频率增加，发射子弹变慢\n300000分\n三种敌机出现频率增加，全体敌机速度加快，发射子弹变慢\n600000分\n小飞机出现频率增加，发射子弹变慢\n1000000分\n三种敌机出现频率增加，全体敌机速度加快，发射子弹变慢");
	start_game();
	startplay4();
	gs = 4;
}

function game_over() {
	var a = document.getElementById("pasue");
	a.style.display = "block";
	var b = document.getElementById("game-over");
	b.style.display = "block";
	gplay = 1;
	gameover = 1;
}

function f5() //刷新页面
{
	location.reload(true);
}

function nandu() {
	var a = document.getElementById("bottom");
	a.style.display = "block";
}

/*
//定义随机数0,1,2Math.round(Math.random()*2)
fonction mn()
{
	
}
*/