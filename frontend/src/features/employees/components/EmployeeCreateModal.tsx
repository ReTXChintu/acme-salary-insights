import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { COUNTRIES, DEPARTMENTS } from "../../../lib/constants/reference-data";
import { useCreateEmployeeMutation } from "../hooks/useEmployeeMutations";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "../schemas";

type EmployeeCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: EmployeeFormValues = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  departmentId: "",
  countryId: "",
};

export function EmployeeCreateModal({
  open,
  onOpenChange,
}: EmployeeCreateModalProps) {
  const createEmployeeMutation = useCreateEmployeeMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await createEmployeeMutation.mutateAsync(values);
    onOpenChange(false);
    reset(defaultValues);
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Create employee</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack as="form" gap="4" id="create-employee-form" onSubmit={onSubmit}>
              <Field.Root invalid={Boolean(errors.employeeCode)}>
                <Field.Label>Employee code</Field.Label>
                <Input {...register("employeeCode")} />
                <Field.ErrorText>{errors.employeeCode?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors.firstName)}>
                <Field.Label>First name</Field.Label>
                <Input {...register("firstName")} />
                <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors.lastName)}>
                <Field.Label>Last name</Field.Label>
                <Input {...register("lastName")} />
                <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors.email)}>
                <Field.Label>Email</Field.Label>
                <Input type="email" {...register("email")} />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors.departmentId)}>
                <Field.Label>Department</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register("departmentId")}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <Field.ErrorText>{errors.departmentId?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors.countryId)}>
                <Field.Label>Country</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register("countryId")}>
                    <option value="">Select country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <Field.ErrorText>{errors.countryId?.message}</Field.ErrorText>
              </Field.Root>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.ActionTrigger>
            <Button
              type="submit"
              form="create-employee-form"
              loading={createEmployeeMutation.isPending}
            >
              Create employee
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
