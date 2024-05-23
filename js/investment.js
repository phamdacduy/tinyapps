document
  .getElementById('calculateBtn')
  .addEventListener('click', calculateInvestment);

function calculateInvestment() {
  const startingAmount = parseFloat(
    document.getElementById('startingAmount').value
  );
  const years = parseInt(document.getElementById('years').value);
  const returnRate =
    parseFloat(document.getElementById('returnRate').value) / 100;
  const compound = document.getElementById('compound').value;
  const contributionAmount = parseFloat(
    document.getElementById('contributionAmount').value
  );
  const contributionTiming = document.querySelector(
    'input[name="contributionTiming"]:checked'
  ).value;
  const contributionFrequency = document.querySelector(
    'input[name="contributionFrequency"]:checked'
  ).value;

  const compoundsPerYear = getCompoundsPerYear(compound);
  const contributionsPerYear = contributionFrequency === 'month' ? 12 : 1;

  let totalContributions = 0;
  let balance = startingAmount;
  let totalInterest = 0;

  const tableBody = document
    .getElementById('investmentTable')
    .querySelector('tbody');
  tableBody.innerHTML = '';

  const yearlyData = [];

  for (let year = 1; year <= years; year++) {
    let interest = 0;
    let yearlyDeposit = 0;

    for (let i = 0; i < compoundsPerYear; i++) {
      if (contributionTiming === 'beginning') {
        balance +=
          contributionAmount * (contributionsPerYear / compoundsPerYear);
        yearlyDeposit +=
          contributionAmount * (contributionsPerYear / compoundsPerYear);
        totalContributions +=
          contributionAmount * (contributionsPerYear / compoundsPerYear);
      }

      const interestEarned = balance * (returnRate / compoundsPerYear);
      balance += interestEarned;
      interest += interestEarned;

      if (contributionTiming === 'end') {
        balance +=
          contributionAmount * (contributionsPerYear / compoundsPerYear);
        yearlyDeposit +=
          contributionAmount * (contributionsPerYear / compoundsPerYear);
        totalContributions +=
          contributionAmount * (contributionsPerYear / compoundsPerYear);
      }
    }

    totalInterest += interest;

    const row = tableBody.insertRow();
    row.insertCell(0).textContent = year;
    row.insertCell(1).textContent = yearlyDeposit.toFixed(2);
    row.insertCell(2).textContent = interest.toFixed(2);
    row.insertCell(3).textContent = balance.toFixed(2);

    yearlyData.push({
      year: year,
      deposit: yearlyDeposit,
      interest: interest,
      balance: balance,
    });
  }

  document.getElementById('endBalance').textContent = balance.toFixed(2);
  document.getElementById('resultStartingAmount').textContent =
    startingAmount.toFixed(2);
  document.getElementById('totalContributions').textContent =
    totalContributions.toFixed(2);
  document.getElementById('totalInterest').textContent =
    totalInterest.toFixed(2);

  document.getElementById('results').style.display = 'block';

  drawBarChart(yearlyData);
}

function getCompoundsPerYear(compound) {
  switch (compound) {
    case 'annually':
      return 1;
    case 'semiannually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'semimonthly':
      return 24;
    case 'biweekly':
      return 26;
    case 'weekly':
      return 52;
    case 'daily':
      return 365;
    default:
      return 1;
  }
}

function drawBarChart(data) {
  const ctx = document.getElementById('investmentChart').getContext('2d');
  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map((d) => d.year),
      datasets: [
        {
          label: 'Deposit',
          data: data.map((d) => d.deposit),
          backgroundColor: '#007bff',
        },
        {
          label: 'Interest',
          data: data.map((d) => d.interest),
          backgroundColor: '#28a745',
        },
        {
          label: 'Balance',
          data: data.map((d) => d.balance),
          backgroundColor: '#dc3545',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amount',
          },
        },
      },
    },
  });
}
