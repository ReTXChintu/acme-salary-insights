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

import { COUNTRIES } from "../../../lib/constants/reference-data";
import { useCreateSalaryMutation } from "../hooks/useSalaryMutations";
import { salaryFormSchema, type SalaryFormValues } from "../schemas";

type AddSalaryModalProps = {
  employeeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: SalaryFormValues = {
  amount: 0,
  currency: "INR",
  effectiveDate: "2026-01-01",
};

export function AddSalaryModal({
  employeeId,
  open,
  onOpenChange,
}: AddSalaryModalProps) {
  const createSalaryMutation = useCreateSalaryMutation(employeeId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalaryFormValues>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await createSalaryMutation.mutateAsync({
      amount: values.amount,
      currency: values.currency,
      effectiveDate: new Date(values.effectiveDate).toISOString(),
    });
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
            <Dialog.Title>Add salary</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack as="form" gap="4" id="add-salary-form" onSubmit={onSubmit}>
              <Field.Root invalid={Boolean(errors.amount)}>
                <Field.Label>Amount</Field.Label>
                <Input type="number" {...register("amount", { valueAsNumber: true })} />
                <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors.currency)}>
                <Field.Label>Currency</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register("currency")}>
                    {COUNTRIES.map((country) => (
                      <option key={country.id} value={country.currency}>
                        {country.currency}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <Field.ErrorText>{errors.currency?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors.effectiveDate)}>
                <Field.Label>Effective date</Field.Label>
                <Input type="date" {...register("effectiveDate")} />
                <Field.ErrorText>{errors.effectiveDate?.message}</Field.ErrorText>
              </Field.Root>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" form="add-salary-form">
              Save salary
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
