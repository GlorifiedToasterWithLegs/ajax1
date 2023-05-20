const url = "https://retoolapi.dev/I5ztWH/customers";
const table = document.getElementById("thetable");
// for some reason, writing to this always returned null for me, but for the record, i wanted to use it.
const loader = document.getElementById("load");
const saver = document.getElementById("save");
const adder = document.getElementById("add");
const deleter = document.getElementById("delete");

loader.addEventListener("click", function(){Startup()})
saver.addEventListener("click", function(){Send()})

Startup();

function Startup() {
	fetch(url)
	.then((response) => response.json())
	.then((data) => TableMaker(data))
}

function TableMaker(input){
	document.getElementById("thetable").innerHTML = ``
	let text = `<thead><tr>`
	for (let i = 0; i < input.length; i++) {
		if (i == 1) {
			text += `</tr></thead>
			<tbody><tr>`
		}
		else if (i != 0){
			text += `</tr></tbody>
			<tbody><tr>`
		}
		for (const j in input[i]){
			const part = input[i][j];
			if (j == "id"){text += `<td id="${i+'_'+j}">${part}</td>`}
			else{text += `<td><input type="text" id="${i+'_'+j}" name="${i+'_'+j}" value="${part}"></td>`}
		} 
	}
	text += `</tr></tbody>`
	document.getElementById("thetable").innerHTML = (text)
}

function Send() {
	fetch(url)
	.then((response) => response.json())
	.then((data) => Scraper(data))
}

function Scraper(input) {
	for (let i = 0; i < input.length; i++) {
		for (const j in input[i]){
			if (j != "id") {
				temp = i +"_"+ j
				temp2 = document.getElementById(temp)
				// the obfuscation hurts but is necessary for some reason
				if (input[i][j] != temp2.value){
					if (j == "Column 1" && temp2.value.length < 6){throw new Error((i+1)+". row needs at least 6 letters in the name!"); continue;}
					let pattern = /.*@.*\..*/
					if (j == "Column 3" && temp2.value != temp2.value.match(pattern) ){throw new Error((i+1)+". row needs a valid E-mail address!"); continue;}
					input[i][j] = temp2.value
				}
			}
		} 
	}
	fetch(url, {
		method: "PUT",
		headers:{
			"Content-Type": "application/json",
		},
		body: JSON.stringify(input)
	})
	.then((response) => response.json())
	.then((data) => {
		console.log("Success!", data)
	})
	.catch((error) => {
		console.log("Error;", error)
	})
	console.log(JSON.stringify(input))
	//not sure why, but this throws a 404 error while also giving a success, and the edit doesn't get saved. As far as i can tell this is correct though.
}
