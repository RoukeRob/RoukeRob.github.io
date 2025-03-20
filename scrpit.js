document.getElementById('csvFile').addEventListener('change', handleFile);

function handleFile(e) {
    const file = e.target.files[0];
    
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            const processed = processData(results.data);
            const newCsv = Papa.unparse(processed);
            downloadCSV(newCsv);
        }
    });
}

function processData(data) {
    // Find highest dataset number
    const datasetNumbers = [...new Set(
        Object.keys(data[0])
            .map(col => col.match(/Data Set (\d+):/))
            .filter(match => match)
            .map(match => parseInt(match[1]))
    )].sort((a, b) => b - a);

    if (datasetNumbers.length === 0) return [];
    
    const maxDataset = datasetNumbers[0];
    const newColumns = {};
    const oldPrefix = `Data Set ${maxDataset}:`;
    const newPrefix = 'Data Set 1:';

    // Create column mapping
    Object.keys(data[0]).forEach(col => {
        if (col.startsWith(oldPrefix)) {
            newColumns[col] = col.replace(oldPrefix, newPrefix);
        }
    });

    // Process data
    return data.map(row => {
        const newRow = {};
        Object.entries(newColumns).forEach(([oldCol, newCol]) => {
            newRow[newCol] = row[oldCol];
        });
        return newRow;
    });
}

function downloadCSV(csv) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}