export default function TextInput({id, name, value, onChange}) {
    return (
        <input
            id={id}
            required
            type="text"
            onChange={onChange}
            name={name}
            value={value}
            class="p-2 mt-1 block w-full rounded-md border-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    )
}
