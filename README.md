# Aura Fit: AI-Powered Fitness & Diet Planner Agent

Aura Fit is a localized health-tech application featuring a rule-based AI recommendation engine that generates personalized diet plans and injury-safe workout schedules based on biometrics, joint restrictions, dietary preferences, and fitness goals.

---

## 🌟 Key Features

1. **Biometric Calculator**: Evaluates BMI (categorized), BMR (Mifflin-St Jeor), and TDEE (based on activity levels).
2. **Safety-First Workout Engine**: Automatically filters out joint-straining exercises if knee, back, or shoulder injuries are specified, replacing them with safe alternatives.
3. **Macro-Customized Diet Generator**: Scales portion sizes of breakfasts, lunches, snacks, and dinners to match calories and macro ratios (Balanced, Low Carb, Keto, High Protein).
4. **AI Safety Confidence Score**: Rates recommendation confidence based on medical/injury constraints, hydration, and sleep indicators.
5. **Interactive Tracker Dashboard**: Logs daily weight, water, and sleep, rendering progress charts via Chart.js.
6. **Adaptive Feedback Loop**: Submits ratings and comments to monitor plan utility.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, Vanilla CSS3 (Indigo/Teal Glassmorphic Theme), Vanilla JS (CORS requests, state control), Chart.js (CDN)
* **Backend**: Python Flask Web Framework
* **Database**: SQLite3
* **AI Logic**: Deterministic Expert Rule-Based Recommendation Engine

---

## 📁 Repository Structure

```
ASSIGNMENT-1/
├── app.py                     # Flask web server endpoints and router
├── database.py                # SQLite schema initiation and data helpers
├── recommender.py             # Calculations formulas, food database, and safety rules
├── populate_test_cases.py     # Script to load the 10 test profiles and generate reports
├── templates/
│   └── index.html             # Main Single Page Application UI template
├── static/
│   ├── css/
│   │   └── style.css          # Design rules, grids, glass themes, and animations
│   └── js/
│       └── app.js             # SPA state, validations, Chart.js logs, API calls
├── project_report.md          # Comprehensive academic project report
├── presentation_slides.md     # PowerPoint presentation slides content outline
└── README.md                  # Setup and usage guide (this file)
```

---

## 🚀 Installation & Setup

Follow these steps to run the application locally on your Windows system:

### 1. Prerequisites
Ensure you have Python 3.8+ installed. You can check this by running:
```bash
python --version
```

### 2. Install Dependencies
Install Flask:
```bash
pip install Flask
```
*(No additional dependencies are needed; SQLite3 and json are included in Python's standard library).*

### 3. Initialize Database & Populate 10 Test Cases
Run the test script to set up the SQLite database and populate it with the 10 diverse test profiles:
```bash
python populate_test_cases.py
```
Upon execution, this script will:
* Create `fitness_planner.db`.
* Populate it with the 10 test profiles, including mock progress data and feedback.
* Save a markdown summary of results to `test_results_summary.md`.

### 4. Run the Web Server
Start the Flask application:
```bash
python app.py
```
The server will start at `http://127.0.0.1:5000/`.

---

## 🖥️ Application Usage Guide

1. **Access the Application**: Open your browser and navigate to `http://127.0.0.1:5000/`.
2. **Onboard a New User**: 
   * Fill out the 3-step wizard (Physiology, Goals, Constraints).
   * Submit to generate your profile, diet, and workout plans.
3. **Select an Existing Profile**:
   * Use the dropdown in the header to switch between the 10 pre-loaded test profiles.
   * The dashboard will update to show selected profile data, including macro splits, weekly workouts, and progress charts.
4. **Log Daily Progress**:
   * Navigate to the **Progress Tracker** tab.
   * Log today's metrics (weight, water, sleep, calories) to update the trend charts.
5. **Submit Feedback**:
   * Navigate to the **Ratings & Feedback** tab.
   * Submit a rating (1-5 stars) and comments to record your feedback.
