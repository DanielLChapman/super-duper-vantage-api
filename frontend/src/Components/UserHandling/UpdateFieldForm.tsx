// UpdateFieldForm.tsx

interface UpdateFieldFormProps {
    label: string;
    placeholder: string;
    value: string;
    error: string;
    fieldType: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

const UpdateFieldForm: React.FC<UpdateFieldFormProps> = ({
    label,
    placeholder,
    value,
    error,
    fieldType,
    onChange,
    onSubmit,
}) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="mt-4"
        >
            <label
                htmlFor={fieldType}
                className="block text-sm font-medium text-gray-700 dark:text-snow"
            >
                {label}
            </label>
            <input
                id={fieldType}
                type={
                    fieldType === "newPassword"
                        ? "password"
                        : fieldType === "newEmail"
                        ? "email"
                        : fieldType === "number" ? "number" : "text"
                }
                placeholder={placeholder}
                value={value}
                autoComplete={fieldType}
                data-testid={fieldType}
                onChange={(e) => onChange(e.target.value)}
                className={`block w-full mt-1 px-3 py-2 border ${
                    error ? "border-persianRed" : "border-gray-300"
                }  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 `}
                {...(fieldType === "number" ? { min: 0, max: 100 } : {})}
            />
            <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Update
            </button>
            {error && (
                <span className="font-bold text-persianRed text-lg">
                    Error: {error}
                </span>
            )}
        </form>
    );
};

export default UpdateFieldForm;
