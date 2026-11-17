/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { AddBillerForm } from "../../../../src/components/features/biller/AddBillerForm";
import { useAddBiller } from "../../../../src/hooks/useAddBiller";

// Add Biller: from the Pay Bills tab's "No enrolled billers yet" sheet
export default function AddBillerScreen() {
  const { isSubmitting, addBiller } = useAddBiller();

  return (
    <AddBillerForm
      isSubmitting={isSubmitting}
      onSubmit={(values, biller) => void addBiller(values, biller)}
    />
  );
}
