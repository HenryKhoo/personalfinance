// The addEventListener will wait for the DOMContentLoaded event to occur before executing the function.
// The DOMContentLoaded is executed when intial HTML is loadad and parsed.
// The loadTableData function will be executed.
// This function is responsible for loading data into table.
// 
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);

document.addEventListener("DOMContentLoaded", function() {
  loadTableData();
  drawChart();
});

function calculate() {
    // The document object with getElementByID function is used to return reference for income and expenses value
    var income = parseFloat(document.getElementById('income').value);
    var expenses = parseFloat(document.getElementById('expenses').value);
    
    // If  income or expenses is not a number (NaN), then the HTML will show the error message.
    if (isNaN(income) || isNaN(expenses)) {
      document.getElementById('result').innerHTML = "Please enter valid numbers.";
      return;
    }
    
    var balance = income - expenses;

    saveDataToLocalStorage(income, expenses, balance);
    
    displayResult(balance);

    loadTableData();
  }


  function saveDataToLocalStorage(income, expenses, balance){
    // The JSON parse function will return the JSON string  to Objects.
    var financialData = JSON.parse(localStorage.getItem('financialData')) || [];
    // The data will push the income, expenses and balance amount to the variable.
    financialData.push({income:income, expenses:expenses, balance: balance});
    // To set the key value pair for local storage variable. 
    // Key is financial Data. Value is to convert the JS value to JSON string.
    localStorage.setItem('financialData', JSON.stringify(financialData))

  }

  function displayResult(){
    var resultElement = document.getElementById('result');
    
    if (balance >= 0) {
      resultElement.innerHTML = "Your balance is: $" + balance.toFixed(2);
    } else {
      resultElement.innerHTML = "You are in debt by: $" + Math.abs(balance).toFixed(2);
    }
  }

  function loadTableData(){

    var financialData = JSON.parse(localStorage.getItem('financialData')) || [];
    var tableBody = document.getElementById('data-body');
    tableBody.innerHTML = "";
    financialData.forEach(function(data) {
    var row = tableBody.insertRow();
    row.insertCell(0).textContent = data.income;
    row.insertCell(1).textContent = data.expenses;
    row.insertCell(2).textContent = data.balance;
  });
  }

  function clearStorageData(){
    localStorage.removeItem('financialData');
    var tableBody = document.getElementById('data-body');
    tableBody.innerHTML = "";
  }

  document.addEventListener("DOMContentLoaded", function() {
    loadTableData();
    drawChart(); // Draw the chart when the page loads
  });
  
  function drawChart() {
    var financialData = JSON.parse(localStorage.getItem('financialData')) || [];
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Month');
    data.addColumn('number', 'Balance');
  
    // Populate the data table with balance data by month
    financialData.forEach(function(entry, index) {
      data.addRow(['Month ' + (index + 1), entry.balance]);
    });
  
    var options = {
      title: 'Balance by Month',
      pieHole: 0.4 // Make the pie chart a donut chart
    };
  
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }