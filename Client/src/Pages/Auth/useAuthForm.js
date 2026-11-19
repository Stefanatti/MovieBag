import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef } from "react";

export default function useAuthForm(schema, defaultValues) {
  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { errors, isSubmitting } = formState;
  const submitting = useRef(false);
  return {
    field: (name) => ({ registration: register(name), issue: errors[name], id: `account-${name}` }),
    submit: (onValid) => async (event) => {
      event.preventDefault();
      if (submitting.current) return;
      submitting.current = true;
      try {
        await handleSubmit(onValid)(event);
      } finally {
        submitting.current = false;
      }
    },
    setError: (message, fieldErrors) => {
      let focus = true;
      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([name, text]) => {
          if (Object.prototype.hasOwnProperty.call(schema.fields, name) &&
              typeof text === "string" && text.trim()) {
            setError(name, { type: "server", message: text }, { shouldFocus: focus });
            focus = false;
          }
        });
      }
      setError("root.server", { message });
    },
    error: errors.root?.server?.message,
    busy: isSubmitting,
  };
}
