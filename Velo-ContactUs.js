// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import wixData from 'wix-data';
$w.onReady(function () {

});
export function button1_click(event) {
	let insert1 = {
		"name": $w('#input2').value,
		"email": $w('#textBox1').value
	}

