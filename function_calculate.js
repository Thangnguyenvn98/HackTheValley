function calculate(key, inputBox, outputBox, fieldID, type, ifYearly) {
    $w(outputBox).text = `Your carbon footprint by ${type} amounts to 0 tonnes yearly`
    wixData.get('Emissions', key)
        .then((item) => {
            let factor = item.fieldID
        })
    $w('#inputBox').onInput(() => {
        let time = parseFloat($w('inputBox').value)
        if(ifYearly) {
            let emission = (time * factor) / 1000
        }
        else {
            let emission = (time * factor * 52) / 1000
        }
        emission = Math.round(emission * 100) / 100
        if(isNaN(emission)) {
            emission = 0
        }
        $w(outputBox).text = `Your carbon footprint by ${type} amounts to ${emission} yearly`
    })
}