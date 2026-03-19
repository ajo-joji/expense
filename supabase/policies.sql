-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_payers ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 0. Helper function to prevent infinite recursion
-- This SECURITY DEFINER function bypasses RLS securely to fetch the user's groups
CREATE OR REPLACE FUNCTION get_user_groups()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT group_id FROM group_members WHERE user_id = auth.uid()
  UNION
  SELECT id FROM groups WHERE created_by = auth.uid();
$$;

-- 1. PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view group members profiles" ON profiles;
CREATE POLICY "Users can view group members profiles" 
ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_id IN (SELECT get_user_groups()) 
    AND user_id = profiles.id
  )
);

-- 2. CATEGORIES 
DROP POLICY IF EXISTS "Users manage own categories" ON categories;
CREATE POLICY "Users manage own categories" 
ON categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. PERSONAL EXPENSES
DROP POLICY IF EXISTS "Users manage own personal expenses" ON personal_expenses;
CREATE POLICY "Users manage own personal expenses" 
ON personal_expenses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. GROUPS
DROP POLICY IF EXISTS "Users can view joined groups" ON groups;
CREATE POLICY "Users can view joined groups"
ON groups FOR SELECT USING (
  id IN (SELECT get_user_groups()) OR created_by = auth.uid()
);

DROP POLICY IF EXISTS "Users can update groups if they belong to it" ON groups;
CREATE POLICY "Users can update groups if they belong to it"
ON groups FOR UPDATE USING (
  id IN (SELECT get_user_groups())
);

DROP POLICY IF EXISTS "Users can create groups" ON groups;
CREATE POLICY "Users can create groups"
ON groups FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Creator can delete groups" ON groups;
CREATE POLICY "Creator can delete groups"
ON groups FOR DELETE USING (auth.uid() = created_by);

-- 5. GROUP MEMBERS
DROP POLICY IF EXISTS "Members can view membership" ON group_members;
CREATE POLICY "Members can view membership"
ON group_members FOR SELECT USING (
  group_id IN (SELECT get_user_groups()) OR user_id = auth.uid()
);

DROP POLICY IF EXISTS "Any authenticated can insert membership" ON group_members;
CREATE POLICY "Any authenticated can insert membership"
ON group_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Members can leave or delete" ON group_members;
CREATE POLICY "Members can leave or delete"
ON group_members FOR DELETE USING (
  user_id = auth.uid() OR group_id IN (SELECT id FROM groups WHERE created_by = auth.uid())
);

-- 6. GROUP EXPENSES
DROP POLICY IF EXISTS "Group members manage group expenses" ON group_expenses;
CREATE POLICY "Group members manage group expenses"
ON group_expenses FOR ALL USING (
  group_id IN (SELECT get_user_groups())
) WITH CHECK (
  group_id IN (SELECT get_user_groups())
);

-- 7. EXPENSE PAYERS
DROP POLICY IF EXISTS "Group members manage payers" ON expense_payers;
CREATE POLICY "Group members manage payers"
ON expense_payers FOR ALL USING (
  EXISTS (SELECT 1 FROM group_expenses WHERE id = expense_payers.expense_id AND group_id IN (SELECT get_user_groups()))
) WITH CHECK (
  EXISTS (SELECT 1 FROM group_expenses WHERE id = expense_payers.expense_id AND group_id IN (SELECT get_user_groups()))
);

-- 8. EXPENSE SPLITS
DROP POLICY IF EXISTS "Group members manage splits" ON expense_splits;
CREATE POLICY "Group members manage splits"
ON expense_splits FOR ALL USING (
  EXISTS (SELECT 1 FROM group_expenses WHERE id = expense_splits.expense_id AND group_id IN (SELECT get_user_groups()))
) WITH CHECK (
  EXISTS (SELECT 1 FROM group_expenses WHERE id = expense_splits.expense_id AND group_id IN (SELECT get_user_groups()))
);

-- 9. SETTLEMENTS
DROP POLICY IF EXISTS "Group members manage settlements" ON settlements;
CREATE POLICY "Group members manage settlements"
ON settlements FOR ALL USING (
  group_id IN (SELECT get_user_groups())
) WITH CHECK (
  group_id IN (SELECT get_user_groups())
);

-- 10. ACTIVITY LOGS
DROP POLICY IF EXISTS "Group members view logs" ON activity_logs;
CREATE POLICY "Group members view logs"
ON activity_logs FOR SELECT USING (
  group_id IN (SELECT get_user_groups())
);

DROP POLICY IF EXISTS "Users insert logs" ON activity_logs;
CREATE POLICY "Users insert logs"
ON activity_logs FOR INSERT WITH CHECK (auth.uid() = actor_user_id);
