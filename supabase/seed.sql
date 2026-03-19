-- Sample Seed Data Template
-- This depends on having an authenticated user ID.
-- DO NOT RUN DIRECTLY UNLESS REPLACING 'your-user-id' WITH A REAL UUID FROM auth.users

/*
DO $$ 
DECLARE
  uid uuid := 'your-user-id-here'; -- Replace with actual user ID
  cat_food uuid := uuid_generate_v4();
  cat_salary uuid := uuid_generate_v4();
  acc_bank uuid := uuid_generate_v4();
BEGIN
  -- Insert Accounts
  INSERT INTO accounts (id, user_id, name, type, balance) 
  VALUES (acc_bank, uid, 'Main Bank', 'bank', 5000.00);

  -- Insert Categories
  INSERT INTO categories (id, user_id, name, type, color, icon) 
  VALUES 
    (cat_food, uid, 'Groceries', 'expense', '#EF4444', 'shopping-cart'),
    (cat_salary, uid, 'Salary', 'income', '#10B981', 'briefcase');

  -- Insert Transactions
  INSERT INTO transactions (user_id, account_id, category_id, type, amount, note, transaction_date)
  VALUES
    (uid, acc_bank, cat_salary, 'income', 4000.00, 'Monthly Salary', CURRENT_DATE),
    (uid, acc_bank, cat_food, 'expense', 150.00, 'Supermarket', CURRENT_DATE);

  -- Insert Budgets
  INSERT INTO budgets (user_id, category_id, month, limit_amount)
  VALUES
    (uid, cat_food, date_trunc('month', CURRENT_DATE)::date, 500.00);

END $$;
*/
