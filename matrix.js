const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const points = [];
const angles = {
	x: 0,
	y: 0,
	z: 0,
};

// töötab
class Matrix3 {
	matrix;

	constructor(x = [], y = [], z = []) {
		this.matrix = [x, y, z];
	}

	multiply(other) {
		const result = new Matrix3();
		for (let i = 0; i < 3; i++) {
			let temp = [];
			for (let j = 0; j < 3; j++) {
				temp.push(
					this.matrix[i][0] * other.matrix[0][j] +
						this.matrix[i][1] * other.matrix[1][j] +
						this.matrix[i][2] * other.matrix[2][j]
				);
			}
			result.matrix[i] = temp;
		}
		return result;
	}
}

function randomInt(minInclusive, maxInclusive) {
	return (
		minInclusive + Math.round(Math.random() * (maxInclusive - minInclusive))
	);
}

function generatePoints() {
	for (let i = 0; i < randomInt(5, 10); i++) {
		const x = Math.round((WIDTH / 2) * (Math.random() - 0.5));
		const y = Math.round((HEIGHT / 2) * (Math.random() - 0.5));
		const z = 1;
		points.push([x, y, z]);
		console.log([x, y, z]);
	}
	points.push(points[0]);
}

function translateToCenter() {
	ctx.translate(WIDTH / 2, HEIGHT / 2);
}

function drawShape() {
	ctx.beginPath();
	for (let i = 0; i < points.length - 1; i++) {
		ctx.moveTo(points[i][0], points[i][1]);
		ctx.lineTo(points[i + 1][0], points[i + 1][1]);
		ctx.stroke();
	}
	ctx.closePath();
}

function getRotationMatrix(axis) {
	const rad = angles[axis] * (Math.PI / 180);
	const matrixes = {
		x: new Matrix3(
			[1, 0, 0],
			[0, Math.cos(rad), Math.sin(rad)],
			[0, -Math.sin(rad), Math.cos(rad)]
		),
		y: new Matrix3(
			[Math.cos(rad), 0, Math.sin(rad)],
			[0, 1, 0],
			[-Math.sin(rad), 0, Math.cos(rad)]
		),
		z: new Matrix3(
			[Math.cos(rad), Math.sin(rad), 0],
			[-Math.sin(rad), Math.cos(rad), 0],
			[0, 0, 1]
		),
	};
	return matrixes[axis];
}

function rotation(axis) {
	const rotationMatrix = getRotationMatrix(axis);
	for (let i = 0; i < points.length; i++) {
		const currentPoint = points[i];
		const pointMatrix = new Matrix3(
			[currentPoint[0], currentPoint[1], currentPoint[2]],
			[0, 0, 0],
			[0, 0, 0]
		);
		const result = pointMatrix.multiply(rotationMatrix);
		points[i] = result.matrix[0];
	}
}

function drawAndRotate() {
	ctx.clearRect(WIDTH / -2, HEIGHT / -2, WIDTH, HEIGHT);
	drawShape();
	rotation("x");
	rotation("y");
	rotation("z");
	requestAnimationFrame(drawAndRotate);
}

canvas.addEventListener("click", (e) => {
	console.log(`Mouse at ${e.offsetX - WIDTH / 2}, ${e.offsetY - HEIGHT / 2}`);
});

document.querySelectorAll("input").forEach((input) => {
	input.addEventListener("change", (e) => {
		angles[input.id] = input.value;
		document.querySelector(
			`label[for = ${input.id}]`
		).textContent = `${input.id}: ${input.value}`;
	});
});

translateToCenter();
generatePoints();
drawAndRotate();
