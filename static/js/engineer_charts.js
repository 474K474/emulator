document.addEventListener('DOMContentLoaded', function() {
    let temperatureChart, loadChart, motorChart;

    async function fetchDataForCharts(paramPrefix, startDate, endDate) {
        let url = `/get_chart_data?device=robotGripper&param=${paramPrefix}1`; // Assuming t1, l1, m1 for simplicity
        if (startDate) url += `&start=${startDate}`;
        if (endDate) url += `&end=${endDate}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching chart data:', error);
            return [];
        }
    }

    async function fetchAndPopulateTable(startDate, endDate) {
        let url = `/get_all_data`;
        // Note: Currently, /get_all_data does not support date range filtering.
        // If needed, we would modify the backend to support start/end time for get_all_measurements

        try {
            const response = await fetch(url);
            const result = await response.json();
            const tableBody = document.getElementById('dataHistoryTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear existing data

            result.data.forEach(row => {
                // Apply client-side filtering if date range is provided for the table
                let rowTimestamp = new Date(row[0]);
                let filterStartDate = startDate ? new Date(startDate) : null;
                let filterEndDate = endDate ? new Date(endDate) : null;

                if ((!filterStartDate || rowTimestamp >= filterStartDate) &&
                    (!filterEndDate || rowTimestamp <= filterEndDate)) {
                    const newRow = tableBody.insertRow();
                    row.forEach(cellData => {
                        const cell = newRow.insertCell();
                        cell.textContent = cellData;
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    }

    function createChart(chartId, label, labels, data, borderColor) {
        const ctx = document.getElementById(chartId).getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: borderColor,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'second'
                        },
                        title: {
                            display: true,
                            text: 'Время'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Значение'
                        }
                    }
                }
            }
        });
    }

    async function updateChartsAndTable() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Update Temperature Chart
        const temp_data = await fetchDataForCharts('t', startDate, endDate);
        const temp_labels = temp_data.map(row => row[0]);
        const temp_values = temp_data.map(row => parseFloat(row[2])); // t1 is the 3rd column

        if (temperatureChart) temperatureChart.destroy();
        temperatureChart = createChart('temperatureChart', 'Температура (t1)', temp_labels, temp_values, 'rgb(255, 99, 132)');

        // Update Load Chart
        const load_data = await fetchDataForCharts('l', startDate, endDate);
        const load_labels = load_data.map(row => row[0]);
        const load_values = load_data.map(row => parseFloat(row[2])); // l1 is the 3rd column

        if (loadChart) loadChart.destroy();
        loadChart = createChart('loadChart', 'Нагрузка (l1)', load_labels, load_values, 'rgb(54, 162, 235)');

        // Update Motor Chart
        const motor_data = await fetchDataForCharts('m', startDate, endDate);
        const motor_labels = motor_data.map(row => row[0]);
        const motor_values = motor_data.map(row => parseFloat(row[2])); // m1 is the 3rd column

        if (motorChart) motorChart.destroy();
        motorChart = createChart('motorChart', 'Мотор (m1)', motor_labels, motor_values, 'rgb(75, 192, 192)');

        // Update History Table
        await fetchAndPopulateTable(startDate, endDate);
    }

    // Initial load of charts and table
    updateChartsAndTable();

    // Attach event listener to the apply button
    document.querySelector('.date-range-selector button').addEventListener('click', updateChartsAndTable);
}); 