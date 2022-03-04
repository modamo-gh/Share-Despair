let tickerInput = document.querySelector("#ticker");
let dateInput = document.querySelector("#date");
let button = document.querySelector("button");
let presentValueParagraph = document.querySelector("#presentValue");

let pastTickerData;
let presentTickerData;
let results = [];

function fetchPastData(ticker, pastDate) {
	return fetch(
		`https://api.polygon.io/v1/open-close/${ticker}/${pastDate}?adjusted=true&apiKey=9j9NH6EgpKgPgLnY5Ga0xRXpKyM6G0RY`
	).then((response) => response.json());
}

function fetchPresentData(ticker) {
	return fetch(
		`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=9j9NH6EgpKgPgLnY5Ga0xRXpKyM6G0RY`
	).then((response) => response.json());
}

function logPastOLCH(pastData) {
	const open = pastData.open;
	const low = pastData.low;
	const close = pastData.close;
	const high = pastData.high;

	const olch = (open + low + close + high) / 4;
	return olch;
}

function logPresentOLCH(presentData) {
	const open = presentData.results[0].o;
	const low = presentData.results[0].l;
	const close = presentData.results[0].c;
	const high = presentData.results[0].h;

	const olch = (open + low + close + high) / 4;
	return olch;
}

button.addEventListener("click", function () {
	Promise.all([
		fetchPastData(tickerInput.value, dateInput.value).then((pastData) =>
			logPastOLCH(pastData)
		),
		fetchPresentData(tickerInput.value).then((presentData) =>
			logPresentOLCH(presentData)
		),
	]).then((results) => {
		const pastOLCH = results[0];
		const presentOLCH = results[1];

		const ratio = presentOLCH / pastOLCH;
		const presentValue = (100 * ratio).toFixed(2);

		presentValueParagraph.innerHTML = `$${presentValue}`;
	});
});
