import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react'

type TProps = {
    setIsLoggingOut: Dispatch<SetStateAction<boolean>>
}

const useLogout = ({ setIsLoggingOut }: TProps) => {

    const router = useRouter();

    const handleLogout = () => {
        setIsLoggingOut(true);

        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        router.push('/login');
    };

    return { handleLogout };
}

export default useLogout