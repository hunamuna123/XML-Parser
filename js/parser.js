let parsedValues = [];
let originalXmlString = '';

function parseXML() {
    const fileInput = document.getElementById('xmlFile');
    const resultDiv = document.getElementById('result');
    const tagNameInput = document.getElementById('tagName');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const xmlString = e.target.result;
            originalXmlString = xmlString;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

            const tagNodes = xmlDoc.getElementsByTagName(tagNameInput.value);
            parsedValues = [];

            for (let i = 0; i < tagNodes.length; i++) {
                const value = tagNodes[i].textContent.trim();
                parsedValues.push(value);
            }

            resultDiv.innerHTML = `Values for "${tagNameInput.value}": ${parsedValues.join(', ')}`;
        };

        reader.readAsText(file);
    } else {
        alert('Выберите XML-файл для парсинга.');
    }
}

function increasePrices() {
    const percentInput = document.getElementById('percentIncrease');
    const percent = parseFloat(percentInput.value);

    if (!isNaN(percent)) {
        const updatedXmlString = originalXmlString.replace(new RegExp(`<${tagNameInput.value}>\\s*\\d+(\\.\\d+)?\\s*<\\/${tagNameInput.value}>`, 'g'), (match) => {
            const currentValue = parseFloat(match.match(/\d+(\.\d+)?/)[0]);
            const updatedValue = currentValue * (1 + percent / 100);
            return `<${tagNameInput.value}>${updatedValue}</${tagNameInput.value}>`;
        });

        const updatedXmlBlob = new Blob([updatedXmlString], {
            type: 'application/xml'
        });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(updatedXmlBlob);
        downloadLink.download = 'updated_file.xml';
        downloadLink.click();
    } else {
        alert('Введите корректное значение процента.');
    }
}