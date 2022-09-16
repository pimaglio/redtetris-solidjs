import { createStore } from "solid-js/store";
// components
import TextInput from "./TextInput";
import { ButtonSpinner } from "../shared/Buttons";

// ----------------------------------------------------------------------

export default function SignInForm(props) {
    const [ form, setForm ] = createStore({
        username: "",
        room: "",
    });

    const handleChange = ( e ) => {
        setForm({ [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.submit({ ...form })
    }

    return (
        <div class="mt-10 sm:mt-0">
            <div class="mt-5 md:col-span-2 md:mt-0">
                <form onSubmit={handleSubmit}>
                    <div class="overflow-hidden shadow sm:rounded-md">
                        <div class="bg-white px-4 py-5 sm:p-6">
                            <div class="grid grid-cols-6 gap-6">
                                <div class="col-span-6 sm:col-span-3">
                                    <label for="room" class="block text-sm font-medium text-gray-700">Room</label>
                                    <TextInput
                                        name='room'
                                        id={'room'}
                                        value={form.room}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div class="col-span-6 sm:col-span-3">
                                    <label for="username"
                                           class="block text-sm font-medium text-gray-700">Username</label>
                                    <TextInput
                                        id={'username'}
                                        name='username'
                                        value={form.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <ButtonSpinner isLoading={props.isLoading} type={'submit'} name={'Join room'}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
