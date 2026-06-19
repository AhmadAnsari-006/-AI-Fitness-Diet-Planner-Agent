# Decision-Making Algorithms in Aura Fit

## Overview of Decision-Making Approach

Aura Fit employs a hybrid decision-making approach combining rule-based expert systems with data-driven calculations to provide safe, personalized health and fitness recommendations.

## Core Decision-Making Components

### 1. Biometric Calculations

#### Body Mass Index (BMI)
```python
BMI = weight (kg) / height (m)²
```
- **Underweight**: BMI < 18.5
- **Normal**: BMI 18.5 - 24.9
- **Overweight**: BMI 25 - 29.9
- **Obese**: BMI ≥ 30

#### Basal Metabolic Rate (BMR)
Using the Mifflin-St Jeor Equation (preferred clinical standard):

**For Males:**
```
BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
```

**For Females:**
```
BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
```

#### Total Daily Energy Expenditure (TDEE)
```
TDEE = BMR × Activity Multiplier
```
- **Sedentary**: 1.2
- **Lightly Active**: 1.375
- **Moderately Active**: 1.55
- **Very Active**: 1.725

### 2. Goal-Based Calorie Adjustments

The system applies goal-specific calorie modifications:

- **Weight Loss**: TDEE - 500 kcal (deficit)
- **Fat Loss**: TDEE - 350 kcal (moderate deficit)
- **Weight Gain**: TDEE + 500 kcal (surplus)
- **Muscle Building**: TDEE + 500 kcal (surplus)
- **Strength Training**: TDEE + 300 kcal (slight surplus)
- **General Fitness**: TDEE (maintenance)

### 3. Macro Distribution Algorithms

#### Diet-Specific Macro Ratios

**Keto Diet:**
- Protein: 25%
- Carbs: 5%
- Fat: 70%

**Low Carb / Fat Loss:**
- Protein: 35%
- Carbs: 25%
- Fat: 40%

**High Protein / Muscle Building:**
- Protein: 30%
- Carbs: 40%
- Fat: 30%

**Balanced / Standard:**
- Protein: 20%
- Carbs: 50%
- Fat: 30%

### 4. Safety-First Exercise Filtering

#### Injury-Based Exercise Substitutions

**Knee Injury/Pain:**
- **Excluded**: Squats, Leg Press, Running, HIIT
- **Substituted**: Bird-Dog, Glute Bridges, Swimming, Rowing

**Back/Spine Pain:**
- **Excluded**: Deadlifts, Squats, HIIT
- **Substituted**: Dumbbell Rows, Leg Press, Cycling

**Shoulder/Rotator Cuff:**
- **Excluded**: Overhead Press, Bench Press, Pushups, Pull-ups
- **Substituted**: Planks, Bird-Dog, Glute Bridges, Dumbbell Rows

**Heart Conditions/Asthma:**
- **Excluded**: HIIT Circuits
- **Substituted**: Brisk Walking, Yoga Flow

### 5. Confidence Scoring Algorithm

The system calculates a confidence score based on risk factors:

```
Base Confidence = 100%
- Injury Present: -15%
- Medical Condition: -15%
- Extreme BMI: -15%
- Advanced Age (>65): -10%
```

**Confidence Categories:**
- **95-100%**: High confidence, standard recommendations
- **80-94%**: Good confidence, minor adjustments
- **70-79%**: Moderate confidence, significant adjustments
- **<70%**: Low confidence, requires professional consultation

## Decision-Making Flow

### Step 1: Data Collection
- Gather user biometrics, goals, constraints
- Validate input ranges and data types
- Check for missing required fields

### Step 2: Biometric Analysis
- Calculate BMI and categorize
- Compute BMR using Mifflin-St Jeor
- Determine TDEE based on activity level
- Apply goal-based calorie adjustments

### Step 3: Safety Assessment
- Check for injuries and medical conditions
- Apply exercise filtering rules
- Calculate confidence score
- Generate advisory notes

### Step 4: Macro Optimization
- Determine macro ratios based on diet preference
- Calculate gram amounts for each macro
- Scale meal portions to match targets
- Ensure allergen-free meal selection

### Step 5: Plan Generation
- Create 7-day workout schedule
- Generate daily meal plans (4 meals/day)
- Include safety warnings where applicable
- Calculate caloric burn estimates

### Step 6: Quality Assurance
- Verify calorie target compliance
- Check macro distribution accuracy
- Ensure exercise safety compliance
- Validate allergen filtering

## Algorithm Advantages

### 1. Safety-First Design
- Explicit injury filtering prevents harmful recommendations
- Medical condition awareness ensures safe exercise selection
- Confidence scoring provides transparency

### 2. Clinical Accuracy
- Uses Mifflin-St Jeor (preferred clinical standard)
- Evidence-based macro distributions
- Activity level adjustments based on research

### 3. Personalization
- Tailored to individual biometrics
- Accounts for dietary preferences and restrictions
- Adapts to fitness goals and experience levels

### 4. Interpretability
- Rule-based approach is fully transparent
- Clear reasoning for each recommendation
- Easy to audit and validate

## Performance Characteristics

### Computational Efficiency
- O(1) complexity for biometric calculations
- O(n) complexity for exercise filtering (n = exercise database size)
- O(m) complexity for meal selection (m = meal database size)
- Overall response time < 100ms for typical requests

### Accuracy Metrics
- BMI calculation: 100% accurate (mathematical formula)
- BMR estimation: Within 10% of measured values (Mifflin-St Jeor accuracy)
- Calorie targets: Precise mathematical calculations
- Macro distributions: Exact percentage-based allocations

## Future Algorithm Enhancements

### 1. Machine Learning Integration
- Predictive models for goal achievement likelihood
- Personalized activity multiplier adjustment
- Adaptive macro ratio optimization

### 2. Advanced Safety Algorithms
- Real-time form analysis for injury prevention
- Fatigue detection and workout adjustment
- Recovery time optimization

### 3. Behavioral Economics
- Motivation-based recommendation adjustments
- Habit formation optimization
- Social influence integration

## Conclusion

Aura Fit's decision-making algorithms provide a robust, safe, and clinically-grounded approach to personalized health and fitness planning. By combining rule-based safety systems with evidence-based calculations, the system delivers accurate recommendations while prioritizing user safety and personalization.
