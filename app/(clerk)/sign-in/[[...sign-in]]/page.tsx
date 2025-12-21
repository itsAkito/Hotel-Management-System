import { SignIn } from "@clerk/nextjs";
import ClerkLayout from "../../layout ";
export default function Page() {
    return(
    <ClerkLayout>
        <SignIn />
    </ClerkLayout>
    )
}