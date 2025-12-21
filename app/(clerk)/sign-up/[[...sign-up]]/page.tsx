import { SignUp } from "@clerk/nextjs";
import ClerkLayout from "../../layout ";
export default function Page() {
    return (
    <ClerkLayout>
        <SignUp />
    </ClerkLayout>
    )
}
