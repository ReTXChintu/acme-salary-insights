import { Button, Dialog, Text } from "@chakra-ui/react";

import { useDeleteEmployeeMutation } from "../hooks/useEmployeeMutations";
import type { Employee } from "../types";

type EmployeeDeleteDialogProps = {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EmployeeDeleteDialog({
  employee,
  open,
  onOpenChange,
}: EmployeeDeleteDialogProps) {
  const deleteEmployeeMutation = useDeleteEmployeeMutation();

  const handleDelete = async () => {
    if (!employee) {
      return;
    }

    await deleteEmployeeMutation.mutateAsync(employee.id);
    onOpenChange(false);
  };

  return (
    <Dialog.Root
      role="alertdialog"
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete employee</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>
              Are you sure you want to delete{" "}
              {employee
                ? `${employee.firstName} ${employee.lastName}`
                : "this employee"}
              ?
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.ActionTrigger>
            <Button
              colorPalette="red"
              loading={deleteEmployeeMutation.isPending}
              onClick={() => void handleDelete()}
            >
              Delete employee
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
