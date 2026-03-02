"""
Unit tests for Budget App
"""

import sys
import os

# Add parent directory to path to import Budget App
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from budget_app import Category, create_spend_chart


class TestCategory:
    """Test cases for Category class"""

    def test_deposit(self):
        """Test deposit method"""
        food = Category("Food")
        food.deposit(1000, "initial deposit")
        assert food.get_balance() == 1000

    def test_withdraw_sufficient_funds(self):
        """Test withdraw with sufficient funds"""
        food = Category("Food")
        food.deposit(1000)
        result = food.withdraw(500, "groceries")
        assert result is True
        assert food.get_balance() == 500

    def test_withdraw_insufficient_funds(self):
        """Test withdraw with insufficient funds"""
        food = Category("Food")
        food.deposit(100)
        result = food.withdraw(500, "groceries")
        assert result is False
        assert food.get_balance() == 100

    def test_transfer_sufficient_funds(self):
        """Test transfer with sufficient funds"""
        food = Category("Food")
        clothing = Category("Clothing")
        food.deposit(1000)
        result = food.transfer(500, clothing)
        assert result is True
        assert food.get_balance() == 500
        assert clothing.get_balance() == 500

    def test_transfer_insufficient_funds(self):
        """Test transfer with insufficient funds"""
        food = Category("Food")
        clothing = Category("Clothing")
        food.deposit(100)
        result = food.transfer(500, clothing)
        assert result is False
        assert food.get_balance() == 100
        assert clothing.get_balance() == 0

    def test_check_funds(self):
        """Test check_funds method"""
        food = Category("Food")
        food.deposit(1000)
        assert food.check_funds(500) is True
        assert food.check_funds(1500) is False

    def test_string_representation(self):
        """Test __str__ method"""
        food = Category("Food")
        food.deposit(1000, "deposit")
        food.withdraw(10.15, "groceries")
        string_repr = str(food)
        assert "Food" in string_repr
        assert "deposit" in string_repr
        assert "groceries" in string_repr
        assert "Total:" in string_repr


class TestSpendChart:
    """Test cases for create_spend_chart function"""

    def test_spend_chart_creation(self):
        """Test spend chart creation"""
        food = Category("Food")
        entertainment = Category("Entertainment")
        business = Category("Business")

        food.deposit(1000)
        entertainment.deposit(1000)
        business.deposit(1000)

        food.withdraw(105.55)
        entertainment.withdraw(33.40)
        business.withdraw(10.99)

        chart = create_spend_chart([food, entertainment, business])

        assert "Percentage spent by category" in chart
        assert "Food" in chart
        assert "Entertainment" in chart
        assert "Business" in chart
        assert "100|" in chart
        assert "0|" in chart

    def test_spend_chart_with_no_spending(self):
        """Test spend chart with categories that have no spending"""
        food = Category("Food")
        food.deposit(1000)

        chart = create_spend_chart([food])

        assert "Percentage spent by category" in chart
        assert "Food" in chart


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
