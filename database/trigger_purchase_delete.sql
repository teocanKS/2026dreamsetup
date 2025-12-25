-- Function to revert item status when purchase is deleted
-- This ensures that when a purchase is deleted, the associated part_item
-- automatically reverts to "active" status instead of staying "bought"

CREATE OR REPLACE FUNCTION revert_item_status_on_purchase_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the part_item status back to 'active'
  UPDATE part_items
  SET status = 'active',
      updated_at = NOW()
  WHERE id = OLD.part_item_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists (for re-running this script)
DROP TRIGGER IF EXISTS on_purchase_delete ON purchases;

-- Create trigger that fires after a purchase is deleted
CREATE TRIGGER on_purchase_delete
  AFTER DELETE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION revert_item_status_on_purchase_delete();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION revert_item_status_on_purchase_delete() TO authenticated;
