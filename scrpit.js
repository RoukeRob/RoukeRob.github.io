document.getElementById('csvFile').addEventListener('change', handleFile);

function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name);
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log('Parsing complete:', results);
            if (results.errors.length) {
                console.error('Parsing errors:', results.errors);
                alert('Error parsing CSV - check console for details');
                return;
            }
            
            const processed = processData(results.data);
            console.log('Processed data:', processed);
            
            if (processed.length === 0) {
                alert('No valid datasets found! Check file format');
                return;
            }
            
            const newCsv = Papa.unparse(processed);
            downloadCSV(newCsv);
        },
        error: function(err) {
            console.error('Parsing error:', err);
            alert('Error reading file - check console for details');
        }
    });
}

function processData(data) {
    if (!data || data.length === 0) {
        console.error('Empty dataset received');
        return [];
    }

    // Debug: Log first row's columns
    console.log('Original columns:', Object.keys(data[0]));

    // Find dataset numbers
    const datasetNumbers = [...new Set(
        Object.keys(data[0])
            .map(col => col.match(/Data Set (\d+):/))
            .filter(match => match)
            .map(match => parseInt(match[1]))
    )].sort((a, b) => b - a);

    console.log('Found datasets:', datasetNumbers);
    
    if (datasetNumbers.length === 0) {
        console.error('No datasets found in columns');
        return [];
    }
    
    const maxDataset = datasetNumbers[0];
    console.log('Processing dataset:', maxDataset);

    // ... rest of original processData function ...
}

// Keep original downloadCSV function
