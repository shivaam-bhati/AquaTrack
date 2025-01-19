import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function DeleteConfirmationDialog({ customer, onDelete, onClose }) {
  return (
    <DialogContent className="sm:max-w-[425px] p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-red-600">
          Confirm Deletion
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <p className="text-gray-600">
          Are you sure you want to delete <span className="font-semibold">{customer.name}</span>? 
          This action cannot be undone.
        </p>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button
          variant="outline"
          className="hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </DialogContent>
  );
}