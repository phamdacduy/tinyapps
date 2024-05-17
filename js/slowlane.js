let myChart = null;

document.addEventListener('DOMContentLoaded', () => {
  updateChart();
});

function updateChart() {
  const monthlySalary = parseFloat(
    document.getElementById('monthlySalary').value
  );
  const annualIncrease =
    parseFloat(document.getElementById('annualIncrease').value) / 100;
  const interestRate =
    parseFloat(document.getElementById('interestRate').value) / 100;
  const spendingRate =
    parseFloat(document.getElementById('spendingRate').value) / 100;
  const targetNumber = parseFloat(
    document.getElementById('targetNumber').value
  );
  const goal = targetNumber;

  let salary = monthlySalary;
  let totalSavings = 0;
  let salaryHistory = [];
  let increaseHistory = []; // Store annual increase percentage
  let savingsHistory = [];
  let interestHistory = []; // Store annual interest
  let cumulativeSavings = [];
  let years = [];
  let annualSavings = 0;

  for (let year = 0; totalSavings < goal; year++) {
    years.push(year);

    // Calculate annual increase percentage
    let currentAnnualIncrease = annualIncrease * 100;
    increaseHistory.push(currentAnnualIncrease);

    // Calculate annual savings
    annualSavings = 0;
    for (let month = 0; month < 12; month++) {
      let monthlySavings = salary * (1 - spendingRate);
      annualSavings += monthlySavings;
    }

    totalSavings += annualSavings;
    let annualInterest = totalSavings * interestRate;
    interestHistory.push(annualInterest);
    totalSavings += annualInterest; // Apply annual interest to total savings

    salaryHistory.push(salary * 12); // Annual salary
    savingsHistory.push(annualSavings);
    cumulativeSavings.push(totalSavings);

    // Adjust salary for the next year
    salary *= 1 + annualIncrease;
  }

  if (myChart) {
    myChart.destroy(); // Destroy existing chart instance
  }

  const ctx = document.getElementById('savingsChart').getContext('2d');
  const data = {
    labels: years,
    datasets: [
      {
        label: 'Annual Salary (VND)',
        data: salaryHistory,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Annual Increase (%)',
        data: increaseHistory,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Annual Savings (VND)',
        data: savingsHistory,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Annual Interest (VND)',
        data: interestHistory,
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        borderColor: 'rgba(255, 205, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Cumulative Savings (VND)',
        data: cumulativeSavings,
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Years to Reach Target',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amount (VND)',
          },
          beginAtZero: true,
        },
      },
    },
  };

  myChart = new Chart(ctx, config); // Create new chart instance

  // Update table
  const tableBody = document.getElementById('savingsTableBody');
  tableBody.innerHTML = '';
  for (let i = 0; i < years.length; i++) {
    const row = `
                   <tr>
                        <td>${years[i]}</td>
                        <td>${salaryHistory[i].toLocaleString('en')}</td>
                        <td>${increaseHistory[i]}%</td>
                        <td>${savingsHistory[i].toLocaleString('en')}</td>
                        <td>${interestHistory[i].toLocaleString('en')}</td>
                        <td>${cumulativeSavings[i].toLocaleString('en')}</td>
                    </tr>
                `;
    tableBody.innerHTML += row;
  }
}
