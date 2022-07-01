// Подключаем наш canvas (холст) и даем ему 2д можно и 3д.

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// переменны позиции астеройда

let aster = [];
//массив выстреров так как их много

let fire = [];

//взрывы массив

let expl = [];

let sum = 0; //счетчик.

//создадим массив коробелей 

let sumTimer = 0;


let timer = 0; // таймер

// Подгружаем астеройд изображения 

const asteroidImg = new Image();
asteroidImg.src = 'img/2.png';

// подгружаем взрыв коробля

const bax = new Image();
bax.src = 'img/6.png';

// подгружаем выстрел

fireImg = new Image();
fireImg.src = 'img/4.png';

//подгружаем взрыв

let explimg = new Image();
explimg.src = 'img/5.png';

// подгружаем игрока

const ship = {
	x: 300,
	y: 300,
	animx: 0,
	animy: 0,
};

const shipImg = new Image();
shipImg.src = "img/3.png";

let flyArray = [shipImg, shipImg, shipImg];



// Подгружаем фон изображения 

const fonImg = new Image();
fonImg.src = 'img/01.jpg';

//считываем мышку 

canvas.addEventListener('mousemove', function (event) {
	ship.x = event.offsetX - 25;
	ship.y = event.offsetY - 13;
});

// Подлючаем чтобы изображение прорисовалась на нашем canvas

//чтобы изображение успевала подгружатся засуним его в функцию.


fonImg.onload = function () { // когдазагружается фон.
	game();


}

// функция render будет только отрисовывать фон.
function render() {



	context.drawImage(fonImg, 0, 0, 700, 600); // 0,0 кординаты 600 .600 размеры.drawImage - функция которая выводит картинку на экран.
	context.drawImage(shipImg, ship.x, ship.y, 80, 80); // рисуем корабль
	if (sumTimer >= 0 && sumTimer <= 10) {
		context.drawImage(shipImg, 600, 0, 40, 40);
		context.drawImage(shipImg, 650, 0, 40, 40);
		context.drawImage(shipImg, 550, 0, 40, 40);

	} else if (sumTimer > 10 && sumTimer <= 20) {
		context.drawImage(bax, ship.x - 60, ship.y - 35, 120, 120);
		context.drawImage(shipImg, 600, 0, 40, 40);
		context.drawImage(shipImg, 550, 0, 40, 40);

	} else if (sumTimer > 20 && sumTimer <= 30) {
		context.drawImage(bax, ship.x - 60, ship.y - 35, 120, 120);
		context.drawImage(bax, ship.x - -10, ship.y - 35, 120, 120);
		context.drawImage(shipImg, 600, 0, 40, 40);
	} else if (sumTimer > 30 && sumTimer < 32) {
		context.drawImage(bax, ship.x - 100, ship.y - 180, 300, 300);
	} else {
		location.reload();
		alert('Вы проиграли');
	}


	for (i in fire) context.drawImage(fireImg, fire[i].x, fire[i].y, 30, 30); // отрисовываем выстрел

	for (i in aster) context.drawImage(asteroidImg, aster[i].x, aster[i].y, 50, 50);

	//рисуем взрыв 

	for (i in expl)
		context.drawImage(explimg, 128 * Math.floor(expl[i].animx), 128 * Math.floor(expl[i].animy), 128, 128, expl[i].x, expl[i].y, 100, 100);

	context.fillStyle = " #FFFFFF";
	context.font = '48px serif';
	context.fillText("Счет: " + sum, 0, 40);

}


//функция которая будет обновлять данные.
function update() {
	//физика
	timer++;
	if (timer % 10 == 0) { // каждый 10 цикл запускается астеройд добавляется через пуш
		aster.push({
			x: Math.random() * 600,
			y: -50,
			dx: Math.random() * 2 - 1,
			dy: Math.random() * 2 + 2,
			del: 0,
		});
	}

	//анимация взрыва

	for (i in expl) {
		expl[i].animx = expl[i].animx + 0.3;
		if (expl[i].animx > 4) { expl[i].animy++; expl[i].animx = 0 }
		if (expl[i].animy > 4) {
			expl.splice(i, 1);
		}
	}

	//выстрелы 
	if (timer % 20 == 0) {
		fire.push({ x: ship.x + 10, y: ship.y, dx: 0, dy: -5.2 });
		fire.push({ x: ship.x + 10, y: ship.y, dx: 0.5, dy: -5 });
		fire.push({ x: ship.x + 10, y: ship.y, dx: -0.5, dy: -5 });
	}

	//двигаем пули

	for (i in fire) {
		fire[i].x = fire[i].x + fire[i].dx;
		fire[i].y = fire[i].y + fire[i].dy;

		if (fire[i].y < -30) fire.shift(i, 1);
	}

	for (i in aster) {


		aster[i].x += aster[i].dx;
		aster[i].y += aster[i].dy;

		//граница
		if (aster[i].x >= 650 || aster[i].x <= 0) aster[i].dx = - aster[i].dx; //aster.dx = - aster.dx чтобы разворачивался 
		if (aster[i].y >= 850) aster.shift(i, 1);

		// сталкновения коробля и астеройда

		if (Math.abs(aster[i].x - ship.x) < 62 && Math.abs(aster[i].y - ship.y) < 62) {
			sumTimer++;



		}
		// Проверяем астеройд на столкновения с каждой пулей

		for (j in fire) {
			if (Math.abs(aster[i].x + 25 - fire[j].x - 15) < 50 && Math.abs(aster[i].y - fire[j].y) < 25) {
				//произошло сталкновение

				//делаем взрыв 

				expl.push({ x: aster[i].x - 25, y: aster[i].y - 25, animx: 0, animy: 0 });

				//получаем астеройд на удаление

				aster[i].del = 1;
				fire.shift(j, 1); break;
			}
		}
		//удаляем астеройд

		if (aster[i].del == 1) {

			aster.splice(i, 1);
			sum++;

		}

	}
}


// функция игровая бесконечная основная
function game() {

	render();
	update();
	// requestAnimationFrame(game); // Браузер запускает функцию с чистотой экрана( если чистота экрана70 герц то 70 раз в секунду);
	requestAnimFrame(game); // чтобы работала во всех браузерах(создадим свою фукнцию. обновления)



}

document.addEventListener('keydown', function (event) {
	if (event.code == 'Space') {
		alert('Продолжить?');
	}

})



// Для все браузеров запуск анимации.

const requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 20);
		};
})();



