// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

// Holy shit man its 4:26 AM and i got it to work. im going to sleep

import wixData from 'wix-data';

$w.onReady(function () {

	function cyclePrompt(promptsList, thisPrompt, direction) {
		let i = promptsList.indexOf(thisPrompt);
		let newPrompt;

		if (direction == "next" && i + 1 < promptsList.length) {
			thisPrompt.hide();
			newPrompt = promptsList[i + 1];
			newPrompt.show();
		} else if (direction == "prev" && i - 1 >= 0) {
			thisPrompt.hide();
			newPrompt = promptsList[i - 1];
			newPrompt.show();
		}
		return newPrompt;
	}

	function checkButton(promptsList, thisPrompt) {
		if (thisPrompt == promptsList[promptsList.length - 2]) {
			$w('#btnNext').hide()
			$w('#btnSubmit').show()
			$w('#btnSubmit').enable()
		} else if (thisPrompt == promptsList[promptsList.length - 1]) {
			$w('#btnSubmit').disable()
		} else if (thisPrompt == promptsList[0]) {
			$w('#btnPrev').disable();
		} else {
			$w('#btnNext').show()
			$w('#btnSubmit').hide()
			$w('#btnNext').enable();
			$w('#btnPrev').enable();
		}
	}

	let prompts = [
		$w('#promptTransport'),
		$w('#promptTravel'),
		$w('#promptHouse'),
		$w('#promptFood'),
		$w('#promptResult'),
	]

	prompts.forEach((prompt) => prompt.hide());
	let currPrompt = prompts[0];
	currPrompt.show();
	checkButton(prompts, currPrompt);

	$w('#btnNext').onClick(() => {
		currPrompt = cyclePrompt(prompts, currPrompt, "next");
		checkButton(prompts, currPrompt);	
	})
	
	$w('#btnSubmit').onClick(() => {
		currPrompt = cyclePrompt(prompts, currPrompt, "next");
		checkButton(prompts, currPrompt);	
		
		emissions.total = emissions.transport + emissions.travel + emissions.electric + emissions.gas + emissions.food;
		emissions.total = Math.round(emissions.total * 100) / 100;

		$w('#resultTotal').text = `
		Transportation: ${emissions.transport} tonnes
		Travel: ${emissions.travel} tonnes
		Electricity: ${emissions.electric} tonnes 
		Natural Gases: ${emissions.gas} tonnes
		Food Consumption: ${emissions.food} tonnes
		Total: ${emissions.total} tonnes
		`
		let emissions_global = 5
		if (emissions.total < emissions_global) {
			$w('#advice').hide()
			$w('#alternative').text = `Awesome, you consumed ${Math.round((emissions.total - emissions_global) / emissions_global * -100)}% less than human's global average`;
		} else if (emissions.total > emissions_global) {
			$w('#advice').show()
			$w('#alternative').text = `Your carbon footprint is above human's global average by ${Math.round((emissions.total - emissions_global) / emissions_global * 100)}%`;
		} else {
			$w('#advice').hide()
			$w('#alternative').text = "You have the same carbon as the human's global average";

		}
	})

	$w('#btnPrev').onClick(() => {
		currPrompt = cyclePrompt(prompts, currPrompt, "prev");
		checkButton(prompts, currPrompt);
	})

	let emissions = {
			transport: 0,
			travel: 0,
			electric: 0,
			gas: 0,
			food: 0,
			total: 0,
		}

	
	let factor = 0;
	function calcFootPrint(ifYearly, inputBox, outputBox, type, id, property) {
		wixData.get('Emissions', id)
			.then ((item) => {
				factor = item[property];
			})
		
		let distance = parseFloat($w(inputBox).value);
		let emission = 0;
		if(ifYearly) {
			emission = (distance * factor) / 1000;
		}
		else {
			emission = (distance * factor * 52) / 1000;
		}
		emission = Math.round(emission * 100) / 100;
		if (isNaN(emission)) {
			emission = 0;
		}
		$w(outputBox).text = `Your carbon footprint by ${type} amounts to ${emission} tonnes yearly`;
		return emission;
	}

    // TRANSPORTATION
	function displayCarEmission(weeklyCarDistance, carFactor) {
		let carEmission = (weeklyCarDistance * carFactor * 52) / 1000;
		carEmission = Math.round(carEmission * 100) / 100;
		if (isNaN(carEmission)) carEmission = 0;
		emissions.transport = carEmission;
		$w('#resultTransport').text = `Your carbon footprint by transportation amounts to ${carEmission} tonnes yearly.`;
	}

	if(currPrompt == prompts[0]) {
		let carType;
		let carFactor;
		let weeklyCarDistance = 0;
		$w('#resultTransport').text = `Your carbon footprint by transportation amounts to 0 tonnes yearly.`

		$w('#dropdownVehicle').onChange(() => {
			carType = $w('#dropdownVehicle').value;
			wixData.query('Emissions')
				.eq('carbonEmitters', carType)
				.find()
				.then ((results) => {
					carFactor = results.items[0].kgKm;
					displayCarEmission(weeklyCarDistance, carFactor);
				})
		})

		$w('#inputVehicle').onInput(() => {
			weeklyCarDistance = parseFloat($w('#inputVehicle').value);
			if (isNaN(weeklyCarDistance)) weeklyCarDistance = 0;
			displayCarEmission(weeklyCarDistance, carFactor);
		})
	}

	$w('#inputPlane').onInput(() => {
		emissions.travel = calcFootPrint(true, '#inputPlane', '#resultTravel', 'travel', '03439c71-2c83-4d5a-8c00-863b1c3f5d27', 'kgKm');
	})

	$w('#inputElec').onInput(() => {
		emissions.electric = calcFootPrint(true, '#inputElec', '#resultElec', 'electricity', 'd88a2fc0-a84b-4b93-a22d-6517a10bb85a', 'kgKwh');
	})

	$w('#inputGas').onInput(() => {
		emissions.gas = calcFootPrint(true, '#inputGas', '#resultGas', 'use of natural gas', '7ff5ad17-cb58-4181-bbf0-186a9717b2f9', 'kgGj');
	})

	$w('#inputFood').onInput(() => {
		emissions.food = calcFootPrint(true, '#inputFood', '#resultFood', 'food consumption', '38dc8d7b-ee17-4994-ba4a-ce172791467f', 'kgKg');
	})
});