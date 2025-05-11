const dropdowns = document.querySelectorAll('.dropdown select');
const convertButton = document.querySelector('form button');
const fromDropdown = document.querySelector('.from select');
const toDropdown = document.querySelector('.to select');
const resultMessage = document.querySelector('.msg');

dropdowns.forEach((dropdown) => {
  for (let currencyCode in countryList) {
    const isDefaultFrom = dropdown.name === 'from' && currencyCode === 'USD';
    const isDefaultTo = dropdown.name === 'to' && currencyCode === 'INR';

    const option = document.createElement('option');

    option.value = currencyCode;
    option.textContent = currencyCode;
    if (isDefaultFrom || isDefaultTo) option.selected = true;

    dropdown.appendChild(option);
  }

  dropdown.addEventListener('change', () => {
    updateFlag(dropdown);
  });
});

function updateFlag(dropdown) {
  const currencyCode = dropdown.value;
  const countryCode = countryList[currencyCode];
  const flagImage = dropdown.parentElement.querySelector('img');

  flagImage.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

async function fetchRates(baseCurrency) {
  const endpoint = `v1/currencies/${baseCurrency}.json`;
  const primaryAPI = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/${endpoint}`;
  const fallbackAPI = `https://latest.currency-api.pages.dev/${endpoint}`;

  try {
    const response = await fetch(primaryAPI);
    if (!response.ok) throw new Error('Primary API failed');
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
}

convertButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const amountInput = document.querySelector('.amount input');
  let amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    amount = 1;
    amountInput.value = 1;
  }

  const fromCurrency = fromDropdown.value.toLowerCase();
  const toCurrency = toDropdown.value.toLowerCase();

  try {
    const exchangeData = await fetchRates(fromCurrency);
    const rate = exchangeData[fromCurrency][toCurrency];
    const convertedAmount = (rate * amount).toFixed(2);

    resultMessage.innerText = `${amount} ${fromCurrency.toUpperCase()} = ${convertedAmount} ${toCurrency.toUpperCase()}`;
  } catch (error) {
    resultMessage.innerText = 'Could not fetch exchange rate.';
    console.error(error);
  }
});
