# Aura Fit - AI Fitness & Diet Planner Agent
*PowerPoint Presentation Content Outline (12 Slides)*

---

## Slide 1: Title Slide
### Aura Fit: AI-Powered Fitness & Diet Planner Agent
* **Subtitle**: An Injury-Aware Rule-Based Recommendation Agent for Health-Tech Solutions
* **Presenter Name**: [Your Name / Team Name]
* **Course/Degree**: B.Tech Computer Science / AI-ML Project
* **Speaker Notes**:
  > Welcome, esteemed evaluators. Today I will present Aura Fit, an intelligent, rule-based AI agent designed to address the safety gaps in modern digital fitness trackers.

---

## Slide 2: Problem Statement
### The Gaps in Personal Health Technology
* **Generic Workout Routing**: Most apps suggest heavy squats or running to individuals with joint injuries, leading to high injury rates.
* **Allergy Ignorance**: Automated plan builders do not account for user-specific food allergies, risking allergen exposure.
* **Lack of Adaptive Loops**: Plans remain static instead of adjusting based on daily logs and user feedback ratings.
* **Speaker Notes**:
  > Most health apps use simple calculators that neglect joint pain, medical conditions like asthma, or food allergies. Aura Fit aims to solve this by building a safety-first recommendation system.

---

## Slide 3: Project Objectives
### What Aura Fit Accomplishes
* **Clinical Health Calculations**: Compute BMI, BMR (Mifflin-St Jeor), TDEE, and Target Calories.
* **Dynamic Exercise Safety Filter**: Automatically substitute exercises based on knee, spine, or shoulder injuries.
* **Diet Macro Harmonizer**: Scale portion sizes of breakfast, lunch, snack, and dinner to match vegetarian, vegan, and keto macros.
* **Progress Trend Dashboard**: Use interactive charts to track weight, water, and sleep.
* **Feedback Loop Optimization**: Track user ratings to monitor plan utility.
* **Speaker Notes**:
  > Our objectives were to build a deterministic system that handles calculations, filters out problematic exercises, scales diet macro requirements, and updates progress trends in real time.

---

## Slide 4: System Architecture
### Aura Fit Tech Stack & Layout
```
+-------------------------------------------------------------+
|               Client Browser (HTML, CSS, JS)                |
|           Form Wizard, Dashboard, Chart.js Logs             |
+------------------------------+------------------------------+
                               |
                        REST API (JSON)
                               |
+------------------------------v------------------------------+
|                Python Flask Web Server App                  |
+------------------------------+------------------------------+
                               |
                  Calculations & Safety Routing
                               |
+------------------------------v------------------------------+
|            AI Decision-Making Engine (Rules Logic)          |
|                 SQLite Database Storage File                |
+-------------------------------------------------------------+
```
* **Speaker Notes**:
  > Here is the architecture. The frontend handles form states and charts. The Flask backend validates inputs, runs the rule engine, and stores data in SQLite.

---

## Slide 5: The System Workflow
### Step-by-Step Data Processing Pipeline
1. **User Onboarding Input**: Collect demographics, goals, injuries, and diet styles.
2. **Input Validation**: Check data limits (e.g. valid height, positive age).
3. **Biometrics Calculation**: Calculate BMI, BMR, TDEE, and Target Calories.
4. **AI Rules Routing**: Determine target macro ratios and filter out exercises based on injuries.
5. **Plan Customization**: Scale meal portions and build the weekly workout schedule.
6. **Progress Tracking**: Render interactive lines and bar charts.
7. **Feedback Loops**: Collect user reviews.
8. **Speaker Notes**:
  > Data flows from onboarding inputs through calculations and rules routing, which then outputs the diet and workout schedules and loads the progress tracker.

---

## Slide 6: Core AI Logic & Metrics
### Biometrics & Macro Allocation Ratios
* **Mifflin-St Jeor Standard BMR**:
  * Male: $10W + 6.25H - 5A + 5$
  * Female: $10W + 6.25H - 5A - 161$
* **Goal caloric targets**: Deficit (-350 to -500 kcal) for weight loss, surplus (+300 to +500 kcal) for muscle gain.
* **Macro Partitioning Pools**:
  * **Keto**: 25% Protein, 5% Carbs, 70% Fat
  * **Low Carb**: 35% Protein, 25% Carbs, 40% Fat
  * **Balanced**: 20% Protein, 50% Carbs, 30% Fat
* **Speaker Notes**:
  > We use Mifflin-St Jeor for BMR. Calorie targets adjust based on the user's goal, and macro ratios map to their diet preferences (keto, low carb, or balanced).

---

## Slide 7: Safety-First Rule Engine
### Joint Injuries & Medical Condition Filters
* **Knee Pain / Injury**: Replaces *Squats* and *Running* with *Glute Bridges* and *Swimming*.
* **Back / Spine Injury**: Replaces *Deadlifts* and *Heavy Squats* with *Dumbbell Rows* and *Cycling*.
* **Rotator Cuff / Shoulder**: Replaces *Overhead Press* and *Bench Press* with *Planks* and *Rows*.
* **Asthma / Heart Conditions**: Replaces *HIIT Circuits* with low-intensity *Brisk Walking*.
* **AI Confidence Score**: Reductions applied for injuries (-15%), medical conditions (-15%), and extreme BMIs (-15%).
* **Speaker Notes**:
  > This is a key safety feature. If a user flags an injury, the engine replaces high-risk exercises with safe, low-impact alternatives. The confidence score reflects these adjustments.

---

## Slide 8: Relational Database Design
### 6 Relational Tables Schema
* **Users**: Demographics, allergies, and lifestyle parameters.
* **FitnessGoals**: Calculated BMR, BMI, target calories, macros, and confidence.
* **DietPlans**: Meal type (Breakfast, Lunch, Snack, Dinner), ingredients list, and macros.
* **WorkoutPlans**: 7-day schedule with exercise details, sets, reps, and MET burn values.
* **ProgressTracking**: Weight logs, water, sleep, calories consumed/burned.
* **Feedback**: Ratings (1-5 stars) and comments.
* **Speaker Notes**:
  > The SQLite database consists of 6 tables, linked by foreign keys with cascading deletes to ensure data consistency.

---

## Slide 9: Automated Testing & Validation
### Summary of the 10 Test Cases Run
* **10 Diverse Profiles Evaluated**:
  1. Beginner Weight Loss
  2. Beginner Weight Gain
  3. Muscle Building
  4. Vegetarian Athlete
  5. Vegan Weight Loss
  6. Senior Citizen
  7. Sedentary Office Worker
  8. College Student
  9. Advanced Gym User
  10. Strength Athlete
* **Result**: 100% database population success. Calorie targets, macro balances, and injury substitutions verified.
* **Speaker Notes**:
  > We created a script, `populate_test_cases.py`, to test the system against 10 diverse profiles. All tests completed successfully.

---

## Slide 10: System UI Screenshots Walkthrough
### Interactive Dashboard Features
* **Form Wizard Onboarding**: Smooth step-by-step form with input validation.
* **Dashboard Badges**: Displays BMI, BMR, TDEE, calorie targets, and confidence score.
* **Nutrition Tab**: Interactive food portions and macro percentages.
* **Workout Tab**: 7-day schedule with sets, reps, and safety warnings.
* **Progress Tracker**: Chart.js lines and bar charts for weight, water, and sleep.
* **Speaker Notes**:
  > The user interface features a step-by-step form and a comprehensive dashboard that displays diet details, weekly workout cards, progress trends, and feedback forms.

---

## Slide 11: Benefits & Future Scope
### Scalability & Expansion
* **Core Benefits**:
  * Local database (no external API costs or latency).
  * High safety and auditability due to the deterministic rule engine.
  * Easy-to-use SPA frontend.
* **Future Scope**:
  * Integrating wearable APIs (Apple Health, Fitbit).
  * Adding an LLM-based chatbot for user questions.
  * Using computer vision to analyze exercise form.
* **Speaker Notes**:
  > Aura Fit is scalable and cost-effective. Future updates will focus on wearable integrations and using computer vision to check form.

---

## Slide 12: Conclusion
### Summary of Achievements
* **Aura Fit** successfully implements a personalized, safety-conscious fitness agent.
* Demonstrates how rule-based expert systems can be used for health applications.
* Addresses the safety limitations of generic fitness models.
* Codebase is structured, verified, and ready for use.
* **Thank You! Questions?**
* **Speaker Notes**:
  > In conclusion, Aura Fit provides a safe and customized health planner. Thank you, and I am open to any questions.
