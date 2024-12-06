import {
  createContext,
  Dispatch,
  FocusEventHandler,
  FormEvent,
  PropsWithChildren,
  Reducer,
  useMemo,
  useReducer
} from "react";
import {
  FieldConfig,
  FieldValues,
  useValidations,
  ValidatorResult
} from "../hooks/useValidations";
import { createContextHook } from "../utilities/react";
import { styled } from "../utilities/stitches";
import { Size } from "../utilities/types";

const StyledForm = styled("form");
export function Form<V extends FieldValues>({
  initialValues,
  size,
  onSubmit,
  ...props
}: PropsWithChildren<{
  size: Size;
  initialValues: V;
  onSubmit: (e: FormEvent<HTMLFormElement>, state: V) => void;
}>) {
  const [state, dispatch] = useReducer(formReducer, initState(initialValues));
  const validations = useValidations(state);

  const value = useMemo(
    (): FormStore<V> => ({
      size,
      state,
      dispatch,
      validations,
      queryFieldProps: name => {
        const hasSubmitted = state.submitted;
        const hasBlurred = state.blurs[name];
        const hasErrors = validations[name]?.errors.length > 0;
        const showError = (hasSubmitted || hasBlurred) && hasErrors;

        return {
          "aria-invalid": hasErrors,
          onBlur: () => dispatch({ type: "blur", payload: { name } }),
          name,
          error: showError
        };
      }
    }),
    [size, state, dispatch, validations]
  );

  return (
    <FormContext.Provider value={value}>
      <StyledForm
        {...props}
        onSubmit={e => {
          e.preventDefault();
          dispatch({ type: "submit", payload: true });

          const error = Object.values(validations).some(
            ({ errors }) => errors.length > 0
          );
          if (error) return;
          onSubmit(e, state.values);
        }}
      />
    </FormContext.Provider>
  );
}
export const FormCheckbox: React.FC = () => {
  return null;
};

export const FormInput: React.FC = () => {
  return null;
};

export const FormSelect: React.FC = () => {
  return null;
};

const FormContext = createContext<FormStore<any> | undefined>(undefined);
const useForm = createContextHook(FormContext);

const initState = <V extends FieldValues>(values: V): FormState => {
  return { values, configs: {}, blurs: {}, submitted: false };
};

const formReducer: Reducer<FormState, FormAction> = (state, action) => {
  switch (action.type) {
    case "change": {
      const values = { ...state.values, ...action.payload };
      return { ...state, values };
    }
    case "blur": {
      const blurs = { ...state.blurs, [action.payload.name]: true };
      return { ...state, blurs };
    }
    case "register": {
      const { field, name } = action.payload;
      const configs = { ...state.configs, [name]: field };
      return { ...state, configs };
    }
    case "unregister": {
      const next = { ...state };
      delete next.configs[action.payload.name];
      return next;
    }
    case "submit":
      return { ...state, submitted: action.payload };
    case "reset":
      return { ...action.payload };
    default:
      throw new Error("Unknown action type");
  }
};

interface FormStore<V extends FieldValues> {
  size: Size;
  state: FormState<V>;
  dispatch: Dispatch<FormAction>;
  validations: Record<keyof V, ValidatorResult>;
  queryFieldProps: <T extends HTMLElement>(
    name: string
  ) => {
    "aria-invalid": boolean;
    onBlur: FocusEventHandler<T>;
    name: string;
    error: boolean;
  };
}

interface FormState<V extends FieldValues = any> {
  values: V;
  configs: Record<keyof V, FieldConfig>;
  blurs: Record<keyof V, boolean>;
  submitted: boolean;
}

type ChangeAction = { type: "change"; payload: any };
type BlurAction = { type: "blur"; payload: { name: string } };
type SubmitAction = { type: "submit"; payload: any };
type RegisterAction = {
  type: "register";
  payload: { name: string; field: FieldConfig };
};
type UnregisterAction = { type: "unregister"; payload: { name: string } };
type ResetAction = { type: "reset"; payload: FormState };
type FormAction =
  | ChangeAction
  | BlurAction
  | RegisterAction
  | UnregisterAction
  | ResetAction
  | SubmitAction;
