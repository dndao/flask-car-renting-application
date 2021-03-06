updateReportsNumber = function(chart) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/reports", true);

    // If specified, responseType must be empty string or "text"
    xhr.responseType = 'text';

    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                result = JSON.parse(xhr.responseText);
                cars = [];
                for (i = 0; i < result.length; i++) {
                    if (!cars.includes(result[i]['car_id']) && result[i]['resolved']==0) {
                       cars.push(result[i]['car_id'])
                    }
                }
                console.log(cars);
                chart.data.datasets.forEach((dataset) => {
                    dataset.data[0] = cars.length;
                });
                chart.update();
                updateCarsNumber(chart)
            }
        }
    };

    xhr.send(null);
}

updateCarsNumber = function(chart) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/cars", true);

    // If specified, responseType must be empty string or "text"
    xhr.responseType = 'text';

    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                chart.data.datasets.forEach((dataset) => {
                    dataset.data[1] = JSON.parse(xhr.responseText).length - dataset.data[0];
                });
                chart.update();
            }
        }
    };

    xhr.send(null);
}

window.onload = function() {
    // Bar chart
    last_five_week_users = JSON.parse(document.getElementById("manager_script").getAttribute("last_five_week_users"));
    var barctx = document.getElementById('barChart').getContext('2d');
    var barChart = new Chart(barctx, {
        type: 'bar',
        data: {
            labels: ['-4 weeks', '-3 weeks', '-2 weeks', '-1 week', 'This week'],
            datasets: [{
                label: 'New customers per week',
                data: last_five_week_users,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Weekly new customers'
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Week'
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    });

    var piectx = document.getElementById('pieChart').getContext('2d');
    // Pie chart
    var pieChart = new Chart(piectx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'In-service Cars',
                'Available Cars'
            ]
        }
    });
    updateReportsNumber(pieChart)
//    updateCarsNumber(pieChart)

    month_revenue = JSON.parse(document.getElementById("manager_script").getAttribute("month-revenue"));
    labels = new Array(month_revenue.length)
    for (i = 0; i < month_revenue.length; i++) {
        labels[i] = i+1
    }
    var linectx = document.getElementById('lineChart').getContext('2d');
    var stackedLine = new Chart(linectx, {
        type: 'line',
        data: {
            datasets: [{
                data: month_revenue,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderWidth: 3,
                fill: false
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: labels
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Daily revenue'
                    },
                    stacked: true
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 5
                        }
                }]
            },
            legend: {
                display: false,
            }
        }
    });
}

