// components
import BackgroundAnimated from "../components/shared/Background/TetriminosAnimated";
import SignInForm from "../components/forms/SignIn";
// context
import { useGameDispatch } from "../context/game";
import { createSignal } from "solid-js";

// ----------------------------------------------------------------------

export default function Home() {
    const [isLoading, setLoading] = createSignal(false)
    const {joinRoom} = useGameDispatch()

    const handleSignIn = async(data) => {
        try {
            setLoading(true)
            await joinRoom(data)
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <section class="flex justify-center items-center h-screen bg-gray-50">
            <BackgroundAnimated/>
            <div>
                <SignInForm isLoading={isLoading()} submit={handleSignIn}/>
            </div>
        </section>
    );
}
