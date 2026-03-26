/*
# Add Unique Constraint to Progress Badges

Prevents duplicate badge awards by adding a unique constraint on (user_id, badge_type).

## Changes
- Add unique constraint to ensure each user can only earn each badge type once
- This prevents race conditions from creating duplicate badge records

## Security
- No RLS changes
- Maintains existing permissions
*/

-- Add unique constraint to prevent duplicate badges
ALTER TABLE progress_badges 
ADD CONSTRAINT progress_badges_user_badge_unique 
UNIQUE (user_id, badge_type);
