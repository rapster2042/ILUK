/*
# Fix Duplicate Small Wins Issue

## Problem
The get_daily_small_wins function was using ORDER BY RANDOM() without setting a seed,
causing non-deterministic results. This meant multiple calls could return different
wins, including duplicates.

## Solution
Use the date seed with setseed() to make random selection deterministic for the same day.
This ensures:
- All calls on the same day return the same wins in the same order
- Different wins are shown each day
- No duplicate wins appear in the same session

## Changes
- Add PERFORM setseed() before the query to set deterministic random seed
- Seed is based on current date, ensuring daily rotation
- Modulo and division ensure seed is between 0 and 1 as required
*/

CREATE OR REPLACE FUNCTION get_daily_small_wins(
  p_user_uuid text,
  p_count int DEFAULT 3
)
RETURNS TABLE (
  id bigint,
  title text,
  category text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_date_seed int;
  v_excluded_ids bigint[];
BEGIN
  -- Use current date as seed for deterministic selection
  v_date_seed := EXTRACT(EPOCH FROM CURRENT_DATE)::int;
  
  -- Set random seed based on date for deterministic results
  -- This ensures same wins are returned for all calls on the same day
  PERFORM setseed((v_date_seed % 1000000) / 1000000.0);
  
  -- Get IDs of wins shown in last 30 days for this user
  SELECT ARRAY_AGG(small_win_id)
  INTO v_excluded_ids
  FROM user_small_wins_history
  WHERE user_uuid = p_user_uuid
    AND shown_at > CURRENT_DATE - INTERVAL '30 days';
  
  -- If no excluded IDs, initialize empty array
  IF v_excluded_ids IS NULL THEN
    v_excluded_ids := ARRAY[]::bigint[];
  END IF;
  
  -- Return random wins not shown recently, using date-based seed
  -- RANDOM() is now deterministic because we set the seed above
  RETURN QUERY
  SELECT sw.id, sw.title, sw.category
  FROM small_wins sw
  WHERE sw.id != ALL(v_excluded_ids)
  ORDER BY RANDOM()
  LIMIT p_count;
END;
$$;

GRANT EXECUTE ON FUNCTION get_daily_small_wins TO anon, authenticated;