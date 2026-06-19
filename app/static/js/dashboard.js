document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Wizard Form Navigation (Onboarding)
    // ----------------------------------------------------
    let currentStep = 1;
    // HTML root element used by charts/theme updates
    const htmlEl = document.documentElement;
    const setupSection = document.getElementById('setupSection');
    const setupForm = document.getElementById('setupForm');
    const formSteps = document.querySelectorAll('.form-step');
    const btnPrevStep = document.getElementById('btnPrevStep');
    const btnNextStep = document.getElementById('btnNextStep');
    const btnSubmitForm = document.getElementById('btnSubmitForm');
    const btnNewProfile = document.getElementById('btnNewProfile');
    
    // Header profile switch hook
    const headerProfileSelect = document.getElementById('headerProfileSelect');
    const headerProfileSelectWrapper = document.getElementById('headerProfileSelectWrapper');

    if (btnNextStep) btnNextStep.addEventListener('click', handleNextStep);
    if (btnPrevStep) btnPrevStep.addEventListener('click', handlePrevStep);
    if (setupForm) setupForm.addEventListener('submit', handleFormSubmit);

    // Header selector change trigger
    if (headerProfileSelect) {
        headerProfileSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                loadProfileDetails(e.target.value);
            } else {
                showSetupWizard();
            }
        });
    }

    // Toggle button to add a new profile
    if (btnNewProfile) {
        btnNewProfile.addEventListener('click', () => {
            showSetupWizard();
        });
    }

    function handleNextStep() {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStepUI();
        }
    }

    function handlePrevStep() {
        currentStep--;
        updateStepUI();
    }

    function updateStepUI() {
        formSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) === currentStep) {
                step.classList.add('active');
            }
        });

        if (btnPrevStep) btnPrevStep.disabled = currentStep === 1;
        
        if (currentStep === 3) {
            if (btnNextStep) btnNextStep.classList.add('hidden');
            if (btnSubmitForm) btnSubmitForm.classList.remove('hidden');
        } else {
            if (btnNextStep) btnNextStep.classList.remove('hidden');
            if (btnSubmitForm) btnSubmitForm.classList.add('hidden');
        }
    }

    function validateStep(step) {
        let isValid = true;
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!currentStepEl) return true;
        
        const inputs = currentStepEl.querySelectorAll('[required]');
        
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            
            if (!input.checkValidity() || input.value.trim() === "") {
                input.classList.add('is-invalid');
                isValid = false;
            }
            
            if (input.type === 'number') {
                const val = parseFloat(input.value);
                const min = parseFloat(input.min);
                const max = parseFloat(input.max);
                if (isNaN(val) || val < min || val > max) {
                    input.classList.add('is-invalid');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    // ----------------------------------------------------
    // Profile Switch & UI Hydration
    // ----------------------------------------------------
    let activeProfileId = null;
    let weightChart = null;
    let lifestyleChart = null;

    // Load initial dropdown list
    loadUserProfilesList();

    function loadUserProfilesList() {
        return fetch('/api/profiles')
            .then(res => res.json())
            .then(profiles => {
                if (headerProfileSelect) {
                    headerProfileSelect.innerHTML = '<option value="">-- Switch/New Profile --</option>';
                    profiles.forEach(p => {
                        const opt = document.createElement('option');
                        opt.value = p.id;
                        opt.textContent = p.name;
                        headerProfileSelect.appendChild(opt);
                    });
                    
                    if (profiles.length > 0) {
                        headerProfileSelectWrapper.classList.remove('d-none');
                        // Auto-load the first profile
                        headerProfileSelect.value = profiles[0].id;
                        loadProfileDetails(profiles[0].id);
                    } else {
                        headerProfileSelectWrapper.classList.add('d-none');
                        showSetupWizard();
                    }
                }
            })
            .catch(err => console.error("Error loading profiles:", err));
    }

    function showSetupWizard() {
        if (setupSection) setupSection.classList.remove('hidden');
        const dashboardSection = document.getElementById('dashboardSection');
        if (dashboardSection) dashboardSection.classList.add('hidden');
        if (setupForm) setupForm.reset();
        currentStep = 1;
        updateStepUI();
        activeProfileId = null;
        if (headerProfileSelect) headerProfileSelect.value = "";
    }

    function loadProfileDetails(profileId) {
        activeProfileId = profileId;
        fetch(`/api/profile/${profileId}`)
            .then(res => res.json())
            .then(data => {
                // Show dashboard, hide onboarding
                if (setupSection) setupSection.classList.add('hidden');
                const dashboardSection = document.getElementById('dashboardSection');
                if (dashboardSection) dashboardSection.classList.remove('hidden');
                
                hydrateUI(data);
                loadProgressLogs(profileId);
                loadFeedbackTimeline(profileId);
            })
            .catch(err => console.error("Error loading profile:", err));
    }

    function hydrateUI(data) {
        const u = data.user;
        const g = data.goals;
        const diet = data.diet;

        // Display user banners
        document.getElementById('dispUserName').textContent = u.name;
        document.getElementById('dispUserGoal').innerHTML = `<i class="fa-solid fa-crosshairs"></i> Goal: ${u.fitness_goal} | Experience: ${u.workout_experience}`;
        document.getElementById('dispUserAge').textContent = `${u.age} yrs`;
        document.getElementById('dispUserWeight').textContent = `${u.weight} kg`;
        document.getElementById('dispUserHeight').textContent = `${u.height} cm`;
        document.getElementById('dispUserDiet').textContent = u.diet_preference;

        // Metric badge
        document.getElementById('dispBMI').textContent = g.bmi;
        const bmiCat = document.getElementById('dispBMICat');
        bmiCat.textContent = g.bmi_category;
        bmiCat.className = 'badge';
        
        if (g.bmi_category === 'Normal') bmiCat.classList.add('normal-status');
        else if (g.bmi_category === 'Underweight') bmiCat.classList.add('warning-status');
        else bmiCat.classList.add('danger-status');

        document.getElementById('dispBMR').textContent = `${Math.round(g.bmr).toLocaleString()} kcal`;
        document.getElementById('dispTDEE').textContent = `${Math.round(g.tdee).toLocaleString()} kcal`;
        document.getElementById('dispTargetCals').textContent = `${Math.round(g.target_calories).toLocaleString()} kcal`;

        // Radial confidence
        const ring = document.getElementById('confidenceRing');
        const score = g.confidence_score;
        document.getElementById('dispConfidenceScore').textContent = `${score}%`;
        const offset = 251.2 - (251.2 * score / 100);
        if (ring) ring.style.strokeDashoffset = offset;

        // Advisory logs
        const advisoryDiv = document.getElementById('dispAdvisoryNotes');
        advisoryDiv.innerHTML = "";
        if (g.advisory_notes && g.advisory_notes.length > 0) {
            g.advisory_notes.forEach(note => {
                const p = document.createElement('p');
                p.className = 'warning-note text-warning fw-semibold mb-1';
                p.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${note}`;
                advisoryDiv.appendChild(p);
            });
        } else {
            const p = document.createElement('p');
            p.className = 'green-note text-success fw-semibold mb-0';
            p.innerHTML = `<i class="fa-solid fa-circle-check"></i> Standard healthy profile parameters. Safety engine approved.`;
            advisoryDiv.appendChild(p);
        }

        // Target macros percentages bars
        const cG = g.target_carbs;
        const pG = g.target_protein;
        const fG = g.target_fat;
        const totalMacroCals = (cG*4) + (pG*4) + (fG*9) || 1;

        document.getElementById('dispCarbsG').textContent = `${cG}g (${Math.round((cG*4/totalMacroCals)*100)}%)`;
        document.getElementById('dispProteinG').textContent = `${pG}g (${Math.round((pG*4/totalMacroCals)*100)}%)`;
        document.getElementById('dispFatG').textContent = `${fG}g (${Math.round((fG*9/totalMacroCals)*100)}%)`;

        document.getElementById('innerCarbsBar').style.width = `${(cG*4/totalMacroCals)*100}%`;
        document.getElementById('innerProteinBar').style.width = `${(pG*4/totalMacroCals)*100}%`;
        document.getElementById('innerFatBar').style.width = `${(fG*9/totalMacroCals)*100}%`;

        // Render Meals List
        const mealsList = document.getElementById('mealsList');
        mealsList.innerHTML = "";
        diet.forEach(meal => {
            const col = document.createElement('div');
            col.className = "col-md-6 col-lg-3";
            
            let foodsHtml = "";
            meal.food_items.forEach(food => {
                foodsHtml += `
                    <div class="mb-2.5 pb-2 border-bottom border-white-10">
                        <strong class="text-white text-xs d-block">${food.name}</strong>
                        <span class="text-secondary small d-block" style="font-size: 0.75rem;">${food.serving_g}g | ${food.calories} kcal (P:${food.protein}g C:${food.carbohydrates}g)</span>
                    </div>
                `;
            });

            col.innerHTML = `
                <div class="card bg-glass-compact p-3 border border-white-10 h-100 rounded-3">
                    <h5 class="fw-bold text-primary mb-3 d-flex justify-content-between align-items-center">
                        ${meal.meal_type}
                        <span class="badge bg-primary bg-opacity-10 text-primary small" style="font-size: 0.75rem;">${Math.round(meal.calories)} kcal</span>
                    </h5>
                    <div class="food-items-list mb-3 flex-grow-1">
                        ${foodsHtml}
                    </div>
                    <div class="row g-1 text-center bg-dark bg-opacity-25 py-2 rounded-2">
                        <div class="col-4 border-end border-white-10"><span class="d-block text-secondary small text-xs">C</span><strong class="small text-white">${Math.round(meal.carbohydrates)}g</strong></div>
                        <div class="col-4 border-end border-white-10"><span class="d-block text-secondary small text-xs">P</span><strong class="small text-white">${Math.round(meal.protein)}g</strong></div>
                        <div class="col-4"><span class="d-block text-secondary small text-xs">F</span><strong class="small text-white">${Math.round(meal.fats)}g</strong></div>
                    </div>
                </div>
            `;
            mealsList.appendChild(col);
        });

        // Set up default day (Monday)
        renderWorkoutSchedule(data.workout, "Monday");
        
        // Progress logger form defaults
        document.getElementById('logWeight').value = u.weight;
        document.getElementById('logWater').value = u.water_intake;
        document.getElementById('logSleep').value = u.sleep_hours;
        document.getElementById('logCalConsumed').value = Math.round(g.target_calories);
        document.getElementById('logCalBurned').value = 0;
        document.getElementById('logDate').value = new Date().toISOString().split('T')[0];
    }

    // Workout Nav triggers
    const workoutWeekNav = document.getElementById('workoutWeekNav');
    if (workoutWeekNav) {
        workoutWeekNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') && activeProfileId) {
                workoutWeekNav.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                const day = e.target.getAttribute('data-day');
                fetch(`/api/profile/${activeProfileId}`)
                    .then(res => res.json())
                    .then(data => {
                        renderWorkoutSchedule(data.workout, day);
                    });
            }
        });
    }

    function renderWorkoutSchedule(workoutData, day) {
        document.getElementById('selectedDayTitle').textContent = `${day} Exercises`;
        const list = document.getElementById('exerciseCardsList');
        list.innerHTML = "";

        const dayExercises = workoutData[day] || [];
        if (dayExercises.length === 0) {
            list.innerHTML = '<p class="text-secondary small italic text-center p-4">No exercises scheduled for this day.</p>';
            return;
        }

        dayExercises.forEach(ex => {
            const card = document.createElement('div');
            card.className = "d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-3 bg-glass-compact border border-white-10 rounded-3 gap-3";
            
            if (ex.name === "Rest & Recovery") {
                card.innerHTML = `
                    <div>
                        <h6 class="fw-bold text-white mb-1"><i class="fa-solid fa-bed text-primary me-2"></i> ${ex.name}</h6>
                        <p class="text-secondary mb-0 small">${ex.description}</p>
                    </div>
                    <div class="px-3 py-1 bg-success bg-opacity-10 text-success border border-success border-opacity-20 rounded-2 text-center" style="min-width: 90px;">
                        <span class="d-block small text-xs">Cals Burn</span>
                        <strong>0 kcal</strong>
                    </div>
                `;
                list.appendChild(card);
                return;
            }

            const alertHtml = ex.caution ? `<div class="text-warning small mt-1"><i class="fa-solid fa-triangle-exclamation"></i> ${ex.caution}</div>` : '';
            const statusIcon = ex.caution ? 'fa-solid fa-triangle-exclamation text-warning' : 'fa-solid fa-circle-check text-success';

            card.innerHTML = `
                <div>
                    <h6 class="fw-bold text-white mb-1"><i class="${statusIcon} me-2"></i> ${ex.name}</h6>
                    <p class="text-secondary mb-0 small">${ex.description}</p>
                    ${alertHtml}
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="d-flex gap-2">
                        <div class="bg-dark bg-opacity-25 px-2.5 py-1 rounded-2 text-center" style="min-width: 55px;"><span class="d-block text-secondary text-xs">Sets</span><strong class="text-primary small">${ex.sets}</strong></div>
                        <div class="bg-dark bg-opacity-25 px-2.5 py-1 rounded-2 text-center" style="min-width: 65px;"><span class="d-block text-secondary text-xs">Reps</span><strong class="text-primary small">${ex.reps}</strong></div>
                        <div class="bg-dark bg-opacity-25 px-2.5 py-1 rounded-2 text-center" style="min-width: 55px;"><span class="d-block text-secondary text-xs">Rest</span><strong class="text-primary small">${ex.rest_time}</strong></div>
                    </div>
                    <div class="px-3 py-1 bg-success bg-opacity-10 text-success border border-success border-opacity-20 rounded-2 text-center" style="min-width: 90px;">
                        <span class="d-block small text-xs">Burn</span>
                        <strong>${ex.calories_burned} kcal</strong>
                    </div>
                </div>
            `;
            list.appendChild(card);
        });
    }

    // ----------------------------------------------------
    // API Call: Create Profile Submit
    // ----------------------------------------------------
    function handleFormSubmit(e) {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const payload = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            fitness_goal: document.getElementById('fitness_goal').value,
            activity_level: document.getElementById('activity_level').value,
            workout_experience: document.getElementById('workout_experience').value,
            water_intake: document.getElementById('water_intake').value,
            sleep_hours: document.getElementById('sleep_hours').value,
            diet_preference: document.getElementById('diet_preference').value,
            medical_conditions: document.getElementById('medical_conditions').value,
            injuries: document.getElementById('injuries').value,
            allergies: document.getElementById('allergies').value
        };

        showToast("Generating personalized plans...");

        fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) return res.json().then(err => { throw new Error(err.error || 'Server error') });
            return res.json();
        })
        .then(data => {
            showToast("Fitness profile created successfully!");
            setupForm.reset();
            loadUserProfilesList().then(() => {
                if (headerProfileSelect) {
                    headerProfileSelect.value = data.profile_id;
                    loadProfileDetails(data.profile_id);
                }
            });
        })
        .catch(err => alert("Failed to generate profile: " + err.message));
    }

    // ----------------------------------------------------
    // API Call: Daily Logs & Charts Rendering
    // ----------------------------------------------------
    const progressForm = document.getElementById('progressForm');
    if (progressForm) {
        progressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!activeProfileId) return;

            const payload = {
                profile_id: activeProfileId,
                log_date: document.getElementById('logDate').value,
                weight: document.getElementById('logWeight').value,
                water_intake: document.getElementById('logWater').value,
                sleep_hours: document.getElementById('logSleep').value,
                calories_consumed: document.getElementById('logCalConsumed').value,
                calories_burned: document.getElementById('logCalBurned').value
            };

            fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                const msg = document.getElementById('progressStatusMsg');
                msg.className = "alert alert-success mt-3 border border-white-10";
                msg.textContent = "Progress successfully logged!";
                msg.classList.remove('hidden');
                
                showToast("Daily metrics saved!");
                loadProgressLogs(activeProfileId);
                
                setTimeout(() => msg.classList.add('hidden'), 3000);
            })
            .catch(err => {
                const msg = document.getElementById('progressStatusMsg');
                msg.className = "alert alert-danger mt-3 border border-white-10";
                msg.textContent = "Error: " + err.message;
                msg.classList.remove('hidden');
            });
        });
    }

    function loadProgressLogs(profileId) {
        fetch(`/api/progress/${profileId}`)
            .then(res => res.json())
            .then(history => {
                renderProgressCharts(history);
            });
    }

    function renderProgressCharts(history) {
        const dates = history.map(h => h.log_date);
        const weights = history.map(h => h.weight);
        const waters = history.map(h => h.water_intake);
        const sleeps = history.map(h => h.sleep_hours);

        const currentTheme = htmlEl.getAttribute('data-bs-theme');
        const gridColor = currentTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        const textColor = currentTheme === 'dark' ? '#94a3b8' : '#475569';

        if (weightChart) weightChart.destroy();
        if (lifestyleChart) lifestyleChart.destroy();

        // 1. Weight Chart
        const ctxW = document.getElementById('weightChart').getContext('2d');
        weightChart = new Chart(ctxW, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Weight (kg)',
                    data: weights,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.12)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: textColor, font: { family: 'Outfit' } } }
                },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                }
            }
        });

        // 2. Lifestyle Chart (Water bars + Sleep line)
        const maxWater = waters.length ? Math.max(...waters.map(v => parseFloat(v)||0)) : 1;
        const maxSleep = sleeps.length ? Math.max(...sleeps.map(v => parseFloat(v)||0)) : 1;
        const suggestedWaterMax = Math.max(2, Math.ceil(maxWater * 1.3));
        const suggestedSleepMax = Math.max(8, Math.ceil(maxSleep * 1.4));

        const ctxL = document.getElementById('lifestyleChart').getContext('2d');
        lifestyleChart = new Chart(ctxL, {
            data: {
                labels: dates,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Water (L)',
                        data: waters,
                        backgroundColor: 'rgba(13,148,136,0.9)',
                        borderRadius: 6,
                        yAxisID: 'y',
                        order: 1,
                        barPercentage: 0.6,
                        categoryPercentage: 0.6
                    },
                    {
                        type: 'line',
                        label: 'Sleep (hrs)',
                        data: sleeps,
                        borderColor: '#f59e0b',
                        borderWidth: 2.5,
                        backgroundColor: 'rgba(245,158,11,0.06)',
                        fill: false,
                        yAxisID: 'y1',
                        order: 2,
                        pointRadius: 4,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: textColor, font: { family: 'Outfit' } } }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: textColor } },
                    y: {
                        type: 'linear',
                        position: 'left',
                        grid: { color: gridColor },
                        ticks: { color: textColor },
                        title: { display: true, text: 'Water (L)', color: textColor },
                        beginAtZero: true,
                        suggestedMax: suggestedWaterMax
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        grid: { display: false },
                        ticks: { color: textColor },
                        title: { display: true, text: 'Sleep (Hours)', color: textColor },
                        beginAtZero: true,
                        suggestedMax: suggestedSleepMax
                    }
                }
            }
        });
    }

    function updateChartsTheme(theme) {
        const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        const textColor = theme === 'dark' ? '#94a3b8' : '#475569';

        [weightChart, lifestyleChart].forEach(chart => {
            if (chart) {
                chart.options.plugins.legend.labels.color = textColor;
                if (chart.options.scales.x) chart.options.scales.x.ticks.color = textColor;
                if (chart.options.scales.y) {
                    chart.options.scales.y.grid.color = gridColor;
                    chart.options.scales.y.ticks.color = textColor;
                }
                if (chart.options.scales.y1) {
                    chart.options.scales.y1.ticks.color = textColor;
                }
                chart.update();
            }
        });
    }

    // Listen for theme changes from global theme.js
    window.addEventListener('themeChanged', (e) => {
        if (typeof weightChart !== 'undefined' && weightChart) {
            updateChartsTheme(e.detail.theme);
        }
    });

    // ----------------------------------------------------
    // Star Rating Toggle & Feedback Submit
    // ----------------------------------------------------
    const starSelector = document.getElementById('starRatingSelector');
    let ratingValue = 5;

    if (starSelector) {
        starSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('star-btn')) {
                const val = parseInt(e.target.getAttribute('data-value'));
                ratingValue = val;
                document.getElementById('selectedRatingVal').value = val;
                updateStarsUI(val);
            }
        });
    }

    function updateStarsUI(val) {
        const stars = starSelector.querySelectorAll('.star-btn');
        stars.forEach((star, idx) => {
            if (idx < val) {
                star.className = 'fa-solid fa-star star-btn fs-3';
            } else {
                star.className = 'fa-regular fa-star star-btn fs-3 text-secondary';
            }
        });
    }

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!activeProfileId) return;

            const payload = {
                profile_id: activeProfileId,
                rating: ratingValue,
                comments: document.getElementById('feedbackComments').value
            };

            fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                const msg = document.getElementById('feedbackStatusMsg');
                msg.className = "alert alert-success mt-3 border border-white-10";
                msg.textContent = "Review successfully submitted!";
                msg.classList.remove('hidden');
                
                document.getElementById('feedbackComments').value = "";
                ratingValue = 5;
                updateStarsUI(5);
                
                showToast("Feedback submitted!");
                loadFeedbackTimeline(activeProfileId);
                
                setTimeout(() => msg.classList.add('hidden'), 3000);
            })
            .catch(err => {
                const msg = document.getElementById('feedbackStatusMsg');
                msg.className = "alert alert-danger mt-3 border border-white-10";
                msg.textContent = "Submission failed: " + err.message;
                msg.classList.remove('hidden');
            });
        });
    }

    function loadFeedbackTimeline(profileId) {
        fetch(`/api/feedback/${profileId}`)
            .then(res => res.json())
            .then(reviews => {
                const timeline = document.getElementById('feedbackTimeline');
                timeline.innerHTML = "";
                
                if (reviews.length === 0) {
                    timeline.innerHTML = '<p class="text-secondary small italic text-center p-4">No reviews recorded yet for this profile.</p>';
                    return;
                }

                reviews.forEach(r => {
                    let starsHtml = "";
                    for (let i = 1; i <= 5; i++) {
                        if (i <= r.rating) starsHtml += '<i class="fa-solid fa-star text-warning"></i>';
                        else starsHtml += '<i class="fa-regular fa-star text-secondary"></i>';
                    }
                    
                    const block = document.createElement('div');
                    block.className = "p-3 bg-glass-compact border border-white-10 rounded-3";
                    block.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center mb-1.5">
                            <div class="small-stars d-flex gap-0.5">${starsHtml}</div>
                            <span class="text-secondary small" style="font-size: 0.75rem;">${r.log_date}</span>
                        </div>
                        <p class="mb-0 text-white small" style="line-height: 1.4;">${r.comments || 'No comment provided.'}</p>
                    `;
                    timeline.appendChild(block);
                });
            })
            .catch(err => console.error("Error loading reviews:", err));
    }

    // ----------------------------------------------------
    // Toast Alert Notification
    // ----------------------------------------------------
    function showToast(message) {
        const toastEl = document.getElementById('customToast');
        const msgEl = document.getElementById('toastMessage');
        if (toastEl && msgEl) {
            msgEl.textContent = message;
            const bsToast = new bootstrap.Toast(toastEl);
            bsToast.show();
        }
    }
});
