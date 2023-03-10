const romanRef = {
	//reference for numbers

	reference: {
		M: 1000,
		CM: 900,
		D: 500,
		CD: 400,
		C: 100,
		XC: 90,
		L: 50,
		XL: 40,
		X: 10,
		IX: 9,
		V: 5,
		IV: 4,
		I: 1,
	},

	firstDecimal: function (dec) {
		for (let key in romanRef.reference) {
			if (romanRef.reference[key] <= dec) {
				return [romanRef.reference[key], key];
			}
		}
	},

	firstRoman: function (letter) {
		for (let key in romanRef.reference) {
			if (key == letter) {
				return [romanRef.reference[key], key];
			}
		}
	},
};

function convertToRoman(num) {
	//check that input are in allowed format
	const onlyAllowed = /^[0-9]*$/;
	if (onlyAllowed.test(num) === false) return "Tylko liczby całkowite";
	if (num >= 4000) return "Liczby mniejsze niż 4000";

	//variable to add roman characters
	let romanNumber = "";
	//variable to subtract number with itteration in loop below
	let decimalNumber = num;

	//in loop we check, that number is bigger that 0.
	//if so, numberArr contain array with []
	while (decimalNumber > 0) {
		let numberArr = romanRef.firstDecimal(decimalNumber);
		romanNumber += numberArr[1];
		decimalNumber -= numberArr[0];
	}

	return romanNumber;
}

function convertToDecimal(roman) {
	//setting forbidden characters, allowed and that can be only one in the string
	const forbiden = ["IVI", "IXI", "XLX", "LXL", "XCX", "CDC", "CMC"];
	const onlyAllowed = /^[MCDXLVI]*$/;

	const onlyOne = ["CM", "CD", "XC", "XL", "IX", "IV", "L"];

	//validate input format
	if (onlyAllowed.test(roman) === false) return "Tylko wielkie litery";

	//inner contain a array of separeted roman characters, like ['X', 'XL', 'I']
	let inner = separateNumbers(roman);

	let obj = {};

	//in loop we count, how many the same roman characters are in the string
	for (let el of inner) {
		if (obj.hasOwnProperty(el)) {
			obj[el]++;
		} else obj[el] = 1;
	}

	//validate that are any wrong data
	if (
		forbiden.some((el) => roman.match(el)) ||
		roman.includes(...forbiden) ||
		inner[0] == false ||
		Object.values(obj).some((el) => el >= 4) ||
		Object.entries(obj).some((el) => onlyOne.includes(el[0]) && el[1] > 1)
	)
		return "Zły format";

	let dec = 0;

	//in loop we adding together all roman numbers

	while (inner.length > 0) {
		let numberArr = romanRef.firstRoman(inner[0]);
		inner.shift();
		dec += numberArr[0];
	}

	return dec;
}

//function return array of separeted roman numbers. If

function separateNumbers(letters) {
	let letterString = letters;
	let letterArr = [];
	let keyArr = Object.keys(romanRef.reference);
	let n = 0;

	//in loop we push seperated roman charaters to array

	while (letterString.length > 0) {
		//setting Regular Expression, that are the first recognize roman character
		let regex = new RegExp("^" + keyArr[n]);

		//if any characters reference number is bigger that previous in string, retrun [false], exp. XVM.
		if (
			romanRef.reference[letterString[0]] >
			romanRef.reference[letterArr[letterArr.length - 1]]
		)
			return [false];

		//if string contain a character, we add character to array and remove character from sting
		//thaks to n we iterate over all characters one by one- first only M, then CM, then D and so on
		if (regex.test(letterString)) {
			letterArr.push(keyArr[n]);
			letterString = letterString.replace(regex, "");
		} else {
			n++;
		}
	}
	return letterArr;
}

const convertButton = document.getElementById("convert");
const changeSystemButton = document.getElementById("change_system");
const subtitle = document.getElementById("subtitle");
const input = document.getElementById("get_number");

let result = document.getElementById("result");
let isSystemRoman = true;

const changeSystem = () => {
	cleanFields();
	if (isSystemRoman) {
		isSystemRoman = false;
		changeSystemButton.innerHTML = "3 => III";
		subtitle.innerHTML = "liczb dziesiętnych na rzymskie";
		document.getElementById("get_number").placeholder =
			"Wpisz dziesiętną liczbę";
	} else {
		isSystemRoman = true;
		changeSystemButton.innerHTML = "III => 3";
		subtitle.innerHTML = "liczb rzymskich na dziesiętne";
		document.getElementById("get_number").placeholder =
			"Wpisz rzymską liczbę";
	}
};

const convert = () => {
	let toCount = document.getElementById("get_number").value;
	result.style.color = "#fff";
	if (isSystemRoman) {
		result.innerHTML = convertToDecimal(toCount);
	} else {
		result.innerHTML = convertToRoman(toCount);
	}
};

const cleanFields = () => {
	result.innerHTML = "Twój wynik:";
	result.style.color = "#c2c2c2";
	input.value = "";
};

convertButton.addEventListener("click", convert);
changeSystemButton.addEventListener("click", changeSystem);
input.addEventListener("click", cleanFields);
