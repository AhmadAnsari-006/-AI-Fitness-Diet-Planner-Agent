document.addEventListener('DOMContentLoaded', () => {
    // Theme Management (Light/Dark Toggle)
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeToggleIcon = document.getElementById('themeToggleIcon');
    const htmlEl = document.documentElement;

    // Load theme setting from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlEl.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeToggleIcon) {
            if (theme === 'dark') {
                themeToggleIcon.className = 'fa-solid fa-sun text-warning';
            } else {
                themeToggleIcon.className = 'fa-solid fa-moon text-indigo';
            }
        }
        
        // Dispatch custom event for other scripts to react to theme change
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // Test Results Modal Handler
    const testResultsBtn = document.getElementById('testResultsBtn');
    const testResultsModal = document.getElementById('testResultsModal');
    const testResultsContent = document.getElementById('testResultsContent');

    if (testResultsBtn && testResultsModal) {
        testResultsBtn.addEventListener('click', async () => {
            const modal = new bootstrap.Modal(testResultsModal);
            testResultsContent.innerHTML = '<p class="text-center text-secondary"><i class="fa-solid fa-spinner fa-spin"></i> Loading test results...</p>';
            modal.show();

            try {
                const response = await fetch('/api/test-results');
                if (!response.ok) throw new Error('Failed to load test results');
                const data = await response.json();
                
                // Convert markdown table to HTML
                let htmlContent = data.content.replace(/\n/g, '<br>');
                htmlContent = htmlContent.replace(/\|/g, ' | ');
                
                // Parse markdown table
                const lines = data.content.split('\n');
                let tableHtml = '<table class="table table-striped table-hover"><thead><tr>';
                
                // Find the table header
                let headerLine = -1;
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('|') && lines[i].includes('ID')) {
                        headerLine = i;
                        break;
                    }
                }
                
                if (headerLine >= 0) {
                    const headers = lines[headerLine].split('|').filter(h => h.trim());
                    headers.forEach(h => {
                        tableHtml += `<th>${h.trim()}</th>`;
                    });
                    tableHtml += '</tr></thead><tbody>';
                    
                    // Skip divider line and add data rows
                    for (let i = headerLine + 2; i < lines.length; i++) {
                        if (lines[i].includes('|') && !lines[i].includes('---')) {
                            const cells = lines[i].split('|').filter(c => c.trim());
                            tableHtml += '<tr>';
                            cells.forEach(c => {
                                tableHtml += `<td>${c.trim()}</td>`;
                            });
                            tableHtml += '</tr>';
                        }
                    }
                    tableHtml += '</tbody></table>';
                    
                    htmlContent = `
                        <div class="mb-3">
                            <h6 class="fw-bold mb-2">Test Data Overview</h6>
                            <p class="text-secondary small mb-3">This table shows the AI's performance on 10 different test profiles with varying fitness goals, body types, and dietary preferences.</p>
                        </div>
                        ${tableHtml}
                        <div class="mt-3">
                            <p class="text-secondary small mb-2"><strong>Key Metrics:</strong></p>
                            <ul class="text-secondary small">
                                <li><strong>BMI (Cat):</strong> Body Mass Index and category</li>
                                <li><strong>BMR:</strong> Basal Metabolic Rate in kcal</li>
                                <li><strong>Target Cals:</strong> Recommended daily calorie intake</li>
                                <li><strong>Confidence:</strong> AI confidence score in recommendations</li>
                                <li><strong>Ex. Exclusions:</strong> Exercises excluded due to injuries/conditions</li>
                            </ul>
                        </div>
                    `;
                } else {
                    htmlContent = `<pre class="text-secondary small">${data.content}</pre>`;
                }
                
                testResultsContent.innerHTML = htmlContent;
            } catch (error) {
                testResultsContent.innerHTML = `<p class="text-center text-danger">Failed to load test results: ${error.message}</p>`;
            }
        });
    }
});
