"""
tests/conftest.py – Shared pytest fixtures
"""

import pandas as pd
import pytest


@pytest.fixture
def minimal_ibm_df():
    """Minimal DataFrame that mimics IBM HR schema for unit tests.
    Does NOT use real employee data.
    """
    return pd.DataFrame(
        {
            "EmployeeNumber": [1, 2, 3, 4, 5],
            "Age": [35, 28, 42, 31, 50],
            "Attrition": ["No", "Yes", "No", "No", "Yes"],
            "BusinessTravel": ["Travel_Rarely", "Travel_Frequently", "Non-Travel", "Travel_Rarely", "Travel_Rarely"],
            "Department": ["Sales", "Research & Development", "Human Resources", "Sales", "Research & Development"],
            "DistanceFromHome": [5, 20, 1, 8, 3],
            "Education": [3, 2, 4, 3, 2],
            "EmployeeCount": [1, 1, 1, 1, 1],        # constant
            "EnvironmentSatisfaction": [3, 1, 4, 2, 3],
            "Gender": ["Male", "Female", "Male", "Female", "Male"],
            "HourlyRate": [65, 55, 90, 72, 48],
            "JobInvolvement": [3, 2, 4, 3, 1],
            "JobLevel": [2, 1, 3, 2, 1],
            "JobRole": ["Sales Executive", "Research Scientist", "HR", "Sales Executive", "Lab Technician"],
            "JobSatisfaction": [4, 1, 3, 2, 1],
            "MaritalStatus": ["Single", "Married", "Divorced", "Single", "Married"],
            "MonthlyIncome": [5000, 3000, 8000, 4500, 2500],
            "MonthlyRate": [14000, 12000, 20000, 15000, 10000],
            "NumCompaniesWorked": [1, 3, 2, 1, 5],
            "Over18": ["Y", "Y", "Y", "Y", "Y"],     # constant
            "OverTime": ["No", "Yes", "No", "No", "Yes"],
            "PercentSalaryHike": [14, 11, 20, 13, 10],
            "PerformanceRating": [3, 3, 4, 3, 3],
            "RelationshipSatisfaction": [3, 2, 4, 3, 1],
            "StandardHours": [80, 80, 80, 80, 80],   # constant
            "StockOptionLevel": [1, 0, 2, 1, 0],
            "TotalWorkingYears": [10, 4, 18, 7, 20],
            "TrainingTimesLastYear": [3, 2, 4, 3, 1],
            "WorkLifeBalance": [3, 1, 4, 2, 1],
            "YearsAtCompany": [5, 2, 12, 4, 15],
            "YearsInCurrentRole": [4, 2, 8, 3, 10],
            "YearsSinceLastPromotion": [1, 2, 4, 0, 5],
            "YearsWithCurrManager": [3, 1, 7, 2, 8],
        }
    )
